import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowUpDown, Save, X, Tag as TagIcon } from "lucide-react";

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

type SortField = 'created_at' | 'updated_at' | 'email' | 'status' | 'priority';
type SortDirection = 'asc' | 'desc';

interface Props {
  leads: LeadSubmission[];
  onUpdate: () => void;
}

export function LeadManagementTable({ leads, onUpdate }: Props) {
  const { toast } = useToast();
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<LeadSubmission>>({});

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
      if (statusFilter !== 'all' && lead.status !== statusFilter) return false;
      if (priorityFilter !== 'all' && lead.priority !== priorityFilter) return false;
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

  const startEdit = (lead: LeadSubmission) => {
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
    const { error } = await supabase
      .from("lead_submissions")
      .update(editData)
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update lead",
        variant: "destructive",
      });
    } else {
      toast({ title: "Lead updated successfully" });
      setEditingId(null);
      setEditData({});
      onUpdate();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'secondary';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'converted': return 'default';
      case 'qualified': return 'secondary';
      case 'contacted': return 'outline';
      case 'lost': return 'destructive';
      case 'spam': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Status:</span>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-background z-50">
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="qualified">Qualified</SelectItem>
              <SelectItem value="converted">Converted</SelectItem>
              <SelectItem value="lost">Lost</SelectItem>
              <SelectItem value="spam">Spam</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Priority:</span>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-40 bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-background z-50">
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="ml-auto text-sm text-muted-foreground">
          Showing {sortedAndFilteredLeads.length} of {leads.length} leads
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button variant="ghost" size="sm" onClick={() => handleSort('created_at')} className="font-semibold">
                  Created <ArrowUpDown className="ml-1 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" size="sm" onClick={() => handleSort('updated_at')} className="font-semibold">
                  Updated <ArrowUpDown className="ml-1 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" size="sm" onClick={() => handleSort('email')} className="font-semibold">
                  Email <ArrowUpDown className="ml-1 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" size="sm" onClick={() => handleSort('status')} className="font-semibold">
                  Status <ArrowUpDown className="ml-1 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" size="sm" onClick={() => handleSort('priority')} className="font-semibold">
                  Priority <ArrowUpDown className="ml-1 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead>Converted</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedAndFilteredLeads.map((lead) => {
              const isEditing = editingId === lead.id;
              return (
                <TableRow key={lead.id}>
                  <TableCell className="whitespace-nowrap text-sm">{formatDate(lead.created_at)}</TableCell>
                  <TableCell className="whitespace-nowrap text-sm">{formatDate(lead.updated_at)}</TableCell>
                  <TableCell>{lead.email}</TableCell>
                  
                  <TableCell>
                    {isEditing ? (
                      <Select
                        value={editData.status}
                        onValueChange={(value) => setEditData({ ...editData, status: value })}
                      >
                        <SelectTrigger className="w-32 bg-background">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-background z-50">
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="contacted">Contacted</SelectItem>
                          <SelectItem value="qualified">Qualified</SelectItem>
                          <SelectItem value="converted">Converted</SelectItem>
                          <SelectItem value="lost">Lost</SelectItem>
                          <SelectItem value="spam">Spam</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge variant={getStatusColor(lead.status)}>{lead.status}</Badge>
                    )}
                  </TableCell>

                  <TableCell>
                    {isEditing ? (
                      <Select
                        value={editData.priority}
                        onValueChange={(value) => setEditData({ ...editData, priority: value })}
                      >
                        <SelectTrigger className="w-28 bg-background">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-background z-50">
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge variant={getPriorityColor(lead.priority)}>{lead.priority}</Badge>
                    )}
                  </TableCell>

                  <TableCell>
                    {isEditing ? (
                      <Input
                        placeholder="tag1, tag2"
                        value={editData.tags?.join(', ') || ''}
                        onChange={(e) => setEditData({ 
                          ...editData, 
                          tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                        })}
                        className="w-40 bg-background"
                      />
                    ) : (
                      <div className="flex gap-1 flex-wrap">
                        {lead.tags?.map((tag, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            <TagIcon className="w-3 h-3 mr-1" />
                            {tag}
                          </Badge>
                        )) || <span className="text-muted-foreground">—</span>}
                      </div>
                    )}
                  </TableCell>

                  <TableCell>
                    {isEditing ? (
                      <Textarea
                        placeholder="Add notes..."
                        value={editData.admin_notes || ''}
                        onChange={(e) => setEditData({ ...editData, admin_notes: e.target.value })}
                        className="min-w-[200px] bg-background"
                        rows={2}
                      />
                    ) : (
                      <div className="max-w-xs truncate text-sm">
                        {lead.admin_notes || <span className="text-muted-foreground">—</span>}
                      </div>
                    )}
                  </TableCell>

                  <TableCell>
                    {lead.converted ? (
                      <Badge variant="default">✓ Yes</Badge>
                    ) : (
                      <Badge variant="outline">No</Badge>
                    )}
                  </TableCell>

                  <TableCell>
                    {isEditing ? (
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => saveEdit(lead.id)}>
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={cancelEdit}>
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
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
