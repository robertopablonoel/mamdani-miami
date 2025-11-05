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

type SortField = 'created_at' | 'updated_at' | 'name' | 'email' | 'status' | 'priority';
type SortDirection = 'asc' | 'desc';

interface Props {
  contacts: ContactSubmission[];
  onUpdate: () => void;
}

export function ContactManagementTable({ contacts, onUpdate }: Props) {
  const { toast } = useToast();
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<ContactSubmission>>({});

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedAndFilteredContacts = contacts
    .filter(contact => {
      if (statusFilter !== 'all' && contact.status !== statusFilter) return false;
      if (priorityFilter !== 'all' && contact.priority !== priorityFilter) return false;
      
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesEmail = contact.email.toLowerCase().includes(query);
        const matchesName = contact.name.toLowerCase().includes(query);
        const matchesMessage = contact.message?.toLowerCase().includes(query) || false;
        const matchesLocation = contact.location?.toLowerCase().includes(query) || false;
        const matchesPhone = contact.phone?.toLowerCase().includes(query) || false;
        
        if (!matchesEmail && !matchesName && !matchesMessage && !matchesLocation && !matchesPhone) {
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

  const startEdit = (contact: ContactSubmission) => {
    setEditingId(contact.id);
    setEditData({
      status: contact.status,
      priority: contact.priority,
      admin_notes: contact.admin_notes,
      tags: contact.tags,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const saveEdit = async (id: string) => {
    const { error } = await supabase
      .from("contact_submissions")
      .update(editData)
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update contact",
        variant: "destructive",
      });
    } else {
      toast({ title: "Contact updated successfully" });
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
      {/* Search Bar */}
      <div className="flex items-center gap-4">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Search by name, email, phone, location, or message..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 bg-background"
          />
        </div>
        {searchQuery && (
          <Button variant="ghost" size="sm" onClick={() => setSearchQuery('')}>
            Clear
          </Button>
        )}
      </div>

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
          Showing {sortedAndFilteredContacts.length} of {contacts.length} contacts
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
                <Button variant="ghost" size="sm" onClick={() => handleSort('name')} className="font-semibold">
                  Name <ArrowUpDown className="ml-1 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" size="sm" onClick={() => handleSort('email')} className="font-semibold">
                  Email <ArrowUpDown className="ml-1 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Investment</TableHead>
              <TableHead className="min-w-[200px]">Message</TableHead>
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
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedAndFilteredContacts.map((contact) => {
              const isEditing = editingId === contact.id;
              return (
                <TableRow key={contact.id}>
                  <TableCell className="whitespace-nowrap text-sm">{formatDate(contact.created_at)}</TableCell>
                  <TableCell className="whitespace-nowrap text-sm">{formatDate(contact.updated_at)}</TableCell>
                  <TableCell className="font-medium">{contact.name}</TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>{contact.phone || <span className="text-muted-foreground">—</span>}</TableCell>
                  <TableCell>{contact.location || <span className="text-muted-foreground">—</span>}</TableCell>
                  <TableCell>{contact.investment_range || <span className="text-muted-foreground">—</span>}</TableCell>
                  <TableCell>
                    <div className="max-w-[300px]">
                      {contact.message ? (
                        <details className="cursor-pointer">
                          <summary className="text-sm font-medium hover:text-primary">
                            {contact.message.substring(0, 50)}...
                          </summary>
                          <p className="mt-2 text-sm whitespace-pre-wrap bg-muted/50 p-3 rounded-md">
                            {contact.message}
                          </p>
                        </details>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </div>
                  </TableCell>
                  
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
                      <Badge variant={getStatusColor(contact.status)}>{contact.status}</Badge>
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
                      <Badge variant={getPriorityColor(contact.priority)}>{contact.priority}</Badge>
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
                        {contact.tags?.map((tag, i) => (
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
                        {contact.admin_notes || <span className="text-muted-foreground">—</span>}
                      </div>
                    )}
                  </TableCell>

                  <TableCell>
                    {isEditing ? (
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => saveEdit(contact.id)}>
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={cancelEdit}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => startEdit(contact)}>
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
