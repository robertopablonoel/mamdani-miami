import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowUpDown, Save, X, ExternalLink } from "lucide-react";
import { formatCurrency } from "@/lib/savingsCalculator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type QuizLead = {
  id: string;
  created_at: string;
  updated_at: string;
  first_name: string;
  email: string;
  phone: string | null;
  sms_consent: boolean;
  tier: string;
  timeline: string;
  annual_savings: number;
  status: string;
  priority: string;
  admin_notes: string | null;
  tags: string[] | null;
  converted: boolean;
  converted_at: string | null;
  answers: Record<string, string>;
};

type SortField = 'created_at' | 'updated_at' | 'email' | 'first_name' | 'tier' | 'annual_savings' | 'status' | 'priority';
type SortDirection = 'asc' | 'desc';

interface Props {
  leads: QuizLead[];
  onUpdate: () => void;
}

export function QuizLeadManagementTable({ leads, onUpdate }: Props) {
  const { toast } = useToast();
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<QuizLead>>({});
  const [viewingAnswers, setViewingAnswers] = useState<QuizLead | null>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedAndFilteredLeads = leads
    .filter(lead => {
      if (tierFilter !== 'all' && lead.tier !== tierFilter) return false;
      if (statusFilter !== 'all' && lead.status !== statusFilter) return false;

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = lead.first_name.toLowerCase().includes(query);
        const matchesEmail = lead.email.toLowerCase().includes(query);
        const matchesNotes = lead.admin_notes?.toLowerCase().includes(query) || false;

        if (!matchesName && !matchesEmail && !matchesNotes) {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => {
      let aVal: string | number = a[sortField];
      let bVal: string | number = b[sortField];

      if (sortField === 'created_at' || sortField === 'updated_at') {
        aVal = new Date(aVal as string).getTime();
        bVal = new Date(bVal as string).getTime();
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  const startEdit = (lead: QuizLead) => {
    setEditingId(lead.id);
    setEditData({
      status: lead.status,
      priority: lead.priority,
      admin_notes: lead.admin_notes,
      tags: lead.tags,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const saveEdit = async (id: string) => {
    try {
      const { error } = await supabase
        .from('quiz_leads')
        .update(editData)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Lead updated successfully",
      });

      setEditingId(null);
      setEditData({});
      onUpdate();
    } catch (error) {
      console.error('Error updating lead:', error);
      toast({
        title: "Error",
        description: "Failed to update lead",
        variant: "destructive",
      });
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'tier_a_hot_lead': return 'bg-red-100 text-red-800';
      case 'tier_b_nurture_warm': return 'bg-orange-100 text-orange-800';
      case 'tier_c_nurture_cold': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTierLabel = (tier: string) => {
    switch (tier) {
      case 'tier_a_hot_lead': return 'Tier A (Hot)';
      case 'tier_b_nurture_warm': return 'Tier B (Warm)';
      case 'tier_c_nurture_cold': return 'Tier C (Cold)';
      default: return tier;
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <Input
          placeholder="Search by name, email, notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-xs"
        />
        <Select value={tierFilter} onValueChange={setTierFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by tier" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tiers</SelectItem>
            <SelectItem value="tier_a_hot_lead">Tier A (Hot)</SelectItem>
            <SelectItem value="tier_b_nurture_warm">Tier B (Warm)</SelectItem>
            <SelectItem value="tier_c_nurture_cold">Tier C (Cold)</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="qualified">Qualified</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button variant="ghost" size="sm" onClick={() => handleSort('created_at')}>
                  Date <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" size="sm" onClick={() => handleSort('first_name')}>
                  Name <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" size="sm" onClick={() => handleSort('email')}>
                  Email <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>
                <Button variant="ghost" size="sm" onClick={() => handleSort('tier')}>
                  Tier <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" size="sm" onClick={() => handleSort('annual_savings')}>
                  Est. Savings <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Timeline</TableHead>
              <TableHead>
                <Button variant="ghost" size="sm" onClick={() => handleSort('status')}>
                  Status <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" size="sm" onClick={() => handleSort('priority')}>
                  Priority <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Answers</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedAndFilteredLeads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell className="text-sm">
                  {new Date(lead.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>{lead.first_name}</TableCell>
                <TableCell className="text-sm">{lead.email}</TableCell>
                <TableCell className="text-sm">
                  {lead.phone ? (
                    <div>
                      {lead.phone}
                      {lead.sms_consent && (
                        <Badge variant="outline" className="ml-1 text-xs">SMS OK</Badge>
                      )}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge className={getTierColor(lead.tier)}>
                    {getTierLabel(lead.tier)}
                  </Badge>
                </TableCell>
                <TableCell className="font-semibold">
                  {formatCurrency(lead.annual_savings)}
                </TableCell>
                <TableCell className="text-sm">{lead.timeline}</TableCell>
                <TableCell>
                  {editingId === lead.id ? (
                    <Select
                      value={editData.status}
                      onValueChange={(value) => setEditData({ ...editData, status: value })}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="qualified">Qualified</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge variant="outline">{lead.status}</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {editingId === lead.id ? (
                    <Select
                      value={editData.priority}
                      onValueChange={(value) => setEditData({ ...editData, priority: value })}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge
                      variant="outline"
                      className={
                        lead.priority === 'high'
                          ? 'bg-red-50'
                          : lead.priority === 'medium'
                          ? 'bg-orange-50'
                          : 'bg-blue-50'
                      }
                    >
                      {lead.priority}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setViewingAnswers(lead)}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Quiz Answers: {lead.first_name}</DialogTitle>
                        <DialogDescription>
                          Submitted on {new Date(lead.created_at).toLocaleString()}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-3 text-sm">
                        <div>
                          <strong>Housing Status:</strong> {lead.answers.housing_status?.replace(/_/g, ' ')}
                        </div>
                        <div>
                          <strong>Monthly Cost:</strong> {lead.answers.monthly_cost?.replace(/_/g, ' ')}
                        </div>
                        <div>
                          <strong>Income Bracket:</strong> {lead.answers.income_bracket?.replace(/_/g, ' ')}
                        </div>
                        <div>
                          <strong>NYC Frustration:</strong> {lead.answers.frustration?.replace(/_/g, ' ')}
                        </div>
                        <div>
                          <strong>Miami Benefit:</strong> {lead.answers.benefit?.replace(/_/g, ' ')}
                        </div>
                        <div>
                          <strong>Timeline:</strong> {lead.answers.timeline}
                        </div>
                        {lead.answers.concern && (
                          <div>
                            <strong>Concern:</strong> {lead.answers.concern?.replace(/_/g, ' ')}
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
                <TableCell>
                  {editingId === lead.id ? (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => saveEdit(lead.id)}>
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={cancelEdit}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => startEdit(lead)}>
                      Edit
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {sortedAndFilteredLeads.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No quiz leads found matching your filters.
        </div>
      )}
    </div>
  );
}
