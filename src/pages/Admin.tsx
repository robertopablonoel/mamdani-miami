import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Download, BarChart3, LineChart } from "lucide-react";
import * as XLSX from "xlsx";
import { LeadManagementTable } from "@/components/admin/LeadManagementTable";
import { ContactManagementTable } from "@/components/admin/ContactManagementTable";
import { AnalyticsDashboard } from "@/components/admin/AnalyticsDashboard";

type ContactSubmission = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  email: string;
  phone: string | null;
  location: string | null;
  investment_range: string | null;
  message: string | null;
  status: string;
  priority: string;
  admin_notes: string | null;
  tags: string[] | null;
};

type LeadSubmission = {
  id: string;
  created_at: string;
  updated_at: string;
  email: string;
  status: string;
  priority: string;
  admin_notes: string | null;
  tags: string[] | null;
  converted: boolean;
  converted_at: string | null;
};

const Admin = () => {
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([]);
  const [leadSubmissions, setLeadSubmissions] = useState<LeadSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Unauthorized",
          description: "Please sign in to access the admin dashboard",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      // Check if user has admin role using the has_role function
      const { data: hasAdminRole, error } = await supabase.rpc('has_role', {
        _user_id: session.user.id,
        _role: 'admin'
      });

      if (error) {
        console.error("Error checking admin role:", error);
        toast({
          title: "Error",
          description: "Failed to verify admin access",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      if (!hasAdminRole) {
        // Attempt one-time bootstrap: if no admins exist, make this user admin
        const { data: bootstrapped, error: bootstrapError } = await supabase.rpc('bootstrap_admin_if_none', {
          _user_id: session.user.id
        });

        if (bootstrapError) {
          console.error("Bootstrap admin error:", bootstrapError);
          const msg = String(bootstrapError.message || "");
          if (msg.includes("violates foreign key constraint") || msg.includes("user_roles_user_id_fkey")) {
            toast({
              title: "Session invalid",
              description: "Please sign in again to initialize admin access.",
              variant: "destructive",
            });
            await supabase.auth.signOut();
            navigate("/auth");
            return;
          }
        }

        if (bootstrapped) {
          toast({ title: "Admin initialized", description: "Your account was granted admin access." });
        } else {
          toast({
            title: "Access Denied",
            description: "You do not have admin privileges",
            variant: "destructive",
          });
          navigate("/");
          return;
        }
      }

      // User is authenticated and has admin role
      setIsAdmin(true);
      fetchSubmissions();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async () => {
    try {
      const [contactResult, leadResult] = await Promise.all([
        supabase.from("contact_submissions").select("*").order("created_at", { ascending: false }),
        supabase.from("lead_submissions").select("*").order("created_at", { ascending: false }),
      ]);

      if (contactResult.error) throw contactResult.error;
      if (leadResult.error) throw leadResult.error;

      setContactSubmissions(contactResult.data || []);
      setLeadSubmissions(leadResult.data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch submissions",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const exportContactsToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      contactSubmissions.map((sub) => ({
        Date: formatDate(sub.created_at),
        Updated: formatDate(sub.updated_at),
        Name: sub.name,
        Email: sub.email,
        Phone: sub.phone || "—",
        Location: sub.location || "—",
        "Investment Range": sub.investment_range || "—",
        Message: sub.message || "—",
        Status: sub.status,
        Priority: sub.priority,
        Tags: sub.tags?.join(', ') || "—",
        Notes: sub.admin_notes || "—",
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Contacts");
    XLSX.writeFile(workbook, `contacts_${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  const exportLeadsToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      leadSubmissions.map((sub) => ({
        Date: formatDate(sub.created_at),
        Updated: formatDate(sub.updated_at),
        Email: sub.email,
        Status: sub.status,
        Priority: sub.priority,
        Converted: sub.converted ? 'Yes' : 'No',
        Tags: sub.tags?.join(', ') || "—",
        Notes: sub.admin_notes || "—",
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");
    XLSX.writeFile(workbook, `leads_${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  const getStats = () => {
    const contactStats = {
      total: contactSubmissions.length,
      pending: contactSubmissions.filter(c => c.status === 'pending').length,
      converted: contactSubmissions.filter(c => c.status === 'converted').length,
      highPriority: contactSubmissions.filter(c => c.priority === 'high' || c.priority === 'urgent').length,
    };
    
    const leadStats = {
      total: leadSubmissions.length,
      pending: leadSubmissions.filter(l => l.status === 'pending').length,
      converted: leadSubmissions.filter(l => l.converted).length,
      highPriority: leadSubmissions.filter(l => l.priority === 'high' || l.priority === 'urgent').length,
    };

    return { contactStats, leadStats };
  };

  const stats = getStats();

  // Don't render admin content until authorization is verified
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Verifying admin access...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Redirect is handled in checkAuth
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-4 md:p-8">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage leads and contact submissions</p>
          </div>
          <Button onClick={handleLogout} variant="outline">Logout</Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Contacts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.contactStats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.contactStats.pending} pending • {stats.contactStats.converted} converted
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Leads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.leadStats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.leadStats.pending} pending • {stats.leadStats.converted} converted
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">High Priority Contacts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.contactStats.highPriority}</div>
              <p className="text-xs text-muted-foreground mt-1">Require immediate attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">High Priority Leads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.leadStats.highPriority}</div>
              <p className="text-xs text-muted-foreground mt-1">Require immediate attention</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="contacts" className="space-y-6">
          <TabsList className="grid w-full max-w-2xl grid-cols-3">
            <TabsTrigger value="contacts" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Contacts ({contactSubmissions.length})
            </TabsTrigger>
            <TabsTrigger value="leads" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Leads ({leadSubmissions.length})
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <LineChart className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="contacts" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle>Contact Form Submissions</CardTitle>
                <Button onClick={exportContactsToExcel} variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export to Excel
                </Button>
              </CardHeader>
              <CardContent>
                {contactSubmissions.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No submissions yet.</p>
                ) : (
                  <ContactManagementTable contacts={contactSubmissions} onUpdate={fetchSubmissions} />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leads" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle>Lead Magnet Submissions</CardTitle>
                <Button onClick={exportLeadsToExcel} variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export to Excel
                </Button>
              </CardHeader>
              <CardContent>
                {leadSubmissions.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No submissions yet.</p>
                ) : (
                  <LeadManagementTable leads={leadSubmissions} onUpdate={fetchSubmissions} />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <AnalyticsDashboard />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
