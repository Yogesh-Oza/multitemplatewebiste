'use client';

import { useState, useEffect } from 'react';
import { Eye, MessageSquare, Clock, CheckCircle, AlertCircle, TrendingUp, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Complaint {
  id: string;
  type: 'grievance' | 'suggestion' | 'complaint';
  subject: string;
  description: string;
  citizenName: string;
  phone: string;
  email?: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  trackingCode: string;
  escalatedTo?: string;
  history: Array<{
    status: string;
    date: string;
    note: string;
  }>;
  attachments: string[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function FeedbackAdminPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [newStatus, setNewStatus] = useState('');
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await fetch('/api/complaints');
      const data = await response.json();
      setComplaints(data);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (complaintId: string, newStatus: string, note: string) => {
    try {
      const response = await fetch(`/api/complaints/${complaintId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          note: note
        })
      });

      if (response.ok) {
        await fetchComplaints();
        setNewStatus('');
        setNewNote('');
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in_progress':
        return <TrendingUp className="h-4 w-4 text-blue-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'closed':
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'complaint':
        return 'bg-red-100 text-red-800';
      case 'grievance':
        return 'bg-orange-100 text-orange-800';
      case 'suggestion':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredComplaints = complaints.filter(complaint => {
    const statusMatch = statusFilter === 'all' || complaint.status === statusFilter;
    const priorityMatch = priorityFilter === 'all' || complaint.priority === priorityFilter;
    return statusMatch && priorityMatch;
  });

  const getStatusText = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'Resolved';
      case 'in_progress':
        return 'In Progress';
      case 'pending':
        return 'Pending';
      case 'closed':
        return 'Closed';
      default:
        return status;
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'Urgent';
      case 'high':
        return 'High';
      case 'medium':
        return 'Medium';
      case 'low':
        return 'Low';
      default:
        return priority;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'complaint':
        return 'Complaint';
      case 'grievance':
        return 'Grievance';
      case 'suggestion':
        return 'Suggestion';
      default:
        return type;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Feedback & Complaints</h1>
          <p className="text-gray-600">Manage citizen feedback and complaints</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            Total: {complaints.length} | 
            Pending: {complaints.filter(c => c.status === 'pending').length} | 
            Resolved: {complaints.filter(c => c.status === 'resolved').length}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Complaints List */}
      <div className="space-y-4">
        {filteredComplaints.map((complaint) => (
          <Card key={complaint.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{complaint.subject}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    by {complaint.citizenName} • {complaint.phone}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getTypeColor(complaint.type)}>
                    {getTypeText(complaint.type)}
                  </Badge>
                  <Badge className={getPriorityColor(complaint.priority)}>
                    {getPriorityText(complaint.priority)}
                  </Badge>
                  <Badge className={getStatusColor(complaint.status)}>
                    {getStatusIcon(complaint.status)}
                    <span className="ml-1">{getStatusText(complaint.status)}</span>
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-700 line-clamp-2">
                  {complaint.description}
                </p>
                
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>Tracking: {complaint.trackingCode}</span>
                  <span>Created: {new Date(complaint.createdAt).toLocaleDateString()}</span>
                  {complaint.email && <span>Email: {complaint.email}</span>}
                </div>

                {/* Status History */}
                {complaint.history && complaint.history.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Status History</h4>
                    <div className="space-y-1">
                      {complaint.history.slice(-3).map((entry, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs text-gray-600">
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          <span>{entry.note}</span>
                          <span className="ml-auto">
                            {new Date(entry.date).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedComplaint(complaint);
                      setIsModalOpen(true);
                    }}
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                  
                  {complaint.status !== 'resolved' && complaint.status !== 'closed' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusUpdate(complaint.id, 'resolved', 'Issue resolved by admin')}
                      className="text-green-600 hover:text-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Mark Resolved
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detail Modal */}
      {isModalOpen && selectedComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">Complaint Details</h2>
              
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Complaint Information</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Subject:</span> {selectedComplaint.subject}</p>
                      <p><span className="font-medium">Type:</span> {getTypeText(selectedComplaint.type)}</p>
                      <p><span className="font-medium">Priority:</span> {getPriorityText(selectedComplaint.priority)}</p>
                      <p><span className="font-medium">Status:</span> {getStatusText(selectedComplaint.status)}</p>
                      <p><span className="font-medium">Tracking Code:</span> {selectedComplaint.trackingCode}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Citizen Information</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Name:</span> {selectedComplaint.citizenName}</p>
                      <p><span className="font-medium">Phone:</span> {selectedComplaint.phone}</p>
                      {selectedComplaint.email && (
                        <p><span className="font-medium">Email:</span> {selectedComplaint.email}</p>
                      )}
                      <p><span className="font-medium">Submitted:</span> {new Date(selectedComplaint.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                    {selectedComplaint.description}
                  </p>
                </div>

                {/* Status Update */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Update Status</h3>
                  <div className="flex gap-3">
                    <Select value={newStatus} onValueChange={setNewStatus}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="Add note..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      onClick={() => {
                        if (newStatus && newNote) {
                          handleStatusUpdate(selectedComplaint.id, newStatus, newNote);
                          setIsModalOpen(false);
                          setSelectedComplaint(null);
                        }
                      }}
                      disabled={!newStatus || !newNote}
                    >
                      Update
                    </Button>
                  </div>
                </div>

                {/* Full History */}
                {selectedComplaint.history && selectedComplaint.history.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Complete History</h3>
                    <div className="space-y-2">
                      {selectedComplaint.history.map((entry, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-900">{entry.note}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(entry.date).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsModalOpen(false);
                      setSelectedComplaint(null);
                    }}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
