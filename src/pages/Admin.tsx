import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Download } from "lucide-react";
import * as XLSX from "xlsx";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ContactSubmission = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  location: string | null;
  investment_range: string | null;
  message: string | null;
  status: string;
};

type LeadSubmission = {
  id: string;
  created_at: string;
  email: string;
  status: string;
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

  const updateContactStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("contact_submissions")
      .update({ status })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    } else {
      toast({ title: "Status updated" });
      fetchSubmissions();
    }
  };

  const updateLeadStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("lead_submissions")
      .update({ status })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    } else {
      toast({ title: "Status updated" });
      fetchSubmissions();
    }
  };

  const exportContactsToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      contactSubmissions.map((sub) => ({
        Date: formatDate(sub.created_at),
        Name: sub.name,
        Email: sub.email,
        Phone: sub.phone || "—",
        Location: sub.location || "—",
        "Investment Range": sub.investment_range || "—",
        Message: sub.message || "—",
        Status: sub.status,
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
        Email: sub.email,
        Status: sub.status,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");
    XLSX.writeFile(workbook, `leads_${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  const getStatusBadge = (status: string) => {
    const variant = status === "accepted" ? "default" : status === "denied" ? "destructive" : "secondary";
    return <Badge variant={variant}>{status}</Badge>;
  };

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
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif font-bold">Admin Dashboard</h1>
          <Button onClick={handleLogout} variant="outline">Logout</Button>
        </div>

        <Tabs defaultValue="contacts" className="space-y-4">
          <TabsList>
            <TabsTrigger value="contacts">Contact Forms ({contactSubmissions.length})</TabsTrigger>
            <TabsTrigger value="leads">Lead Magnets ({leadSubmissions.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="contacts">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Contact Form Submissions</CardTitle>
                <Button onClick={exportContactsToExcel} variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export to Excel
                </Button>
              </CardHeader>
              <CardContent>
                {contactSubmissions.length === 0 ? (
                  <p className="text-muted-foreground">No submissions yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Investment Range</TableHead>
                          <TableHead>Message</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {contactSubmissions.map((submission) => (
                          <TableRow key={submission.id}>
                            <TableCell className="whitespace-nowrap">{formatDate(submission.created_at)}</TableCell>
                            <TableCell>{submission.name}</TableCell>
                            <TableCell>{submission.email}</TableCell>
                            <TableCell>{submission.phone || "—"}</TableCell>
                            <TableCell>{submission.location || "—"}</TableCell>
                            <TableCell>{submission.investment_range || "—"}</TableCell>
                            <TableCell className="max-w-xs truncate">{submission.message || "—"}</TableCell>
                            <TableCell>{getStatusBadge(submission.status)}</TableCell>
                            <TableCell>
                              <Select
                                value={submission.status}
                                onValueChange={(value) => updateContactStatus(submission.id, value)}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="accepted">Accept</SelectItem>
                                  <SelectItem value="denied">Deny</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leads">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Lead Magnet Submissions</CardTitle>
                <Button onClick={exportLeadsToExcel} variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export to Excel
                </Button>
              </CardHeader>
              <CardContent>
                {leadSubmissions.length === 0 ? (
                  <p className="text-muted-foreground">No submissions yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {leadSubmissions.map((submission) => (
                          <TableRow key={submission.id}>
                            <TableCell className="whitespace-nowrap">{formatDate(submission.created_at)}</TableCell>
                            <TableCell>{submission.email}</TableCell>
                            <TableCell>{getStatusBadge(submission.status)}</TableCell>
                            <TableCell>
                              <Select
                                value={submission.status}
                                onValueChange={(value) => updateLeadStatus(submission.id, value)}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="accepted">Accept</SelectItem>
                                  <SelectItem value="denied">Deny</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
