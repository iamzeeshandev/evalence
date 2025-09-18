"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useDeleteCompanyMutation,
  useGetAllCompaniesQuery,
  useSaveCompanyMutation,
  useUpdateCompanyMutation,
} from "@/services/rtk-query";
import {
  Company,
  CompanyPayload,
  UpdateCompanyPayload,
} from "@/services/rtk-query/company/company-type";
import {
  Building2,
  ClipboardList,
  Edit,
  Filter,
  Mail,
  MapPin,
  Phone,
  Plus,
  Search,
  Trash2,
  Users,
} from "lucide-react";
import { useState } from "react";
import { AddCompanyForm } from "../form/add-company-form";
import { EditCompanyForm } from "../form/edit-company-form";
const mockCompanies: Company[] = [
  {
    id: "1",
    companyName: "TechCorp Solutions",
    firstName: "Salman",
    lastName: "Sheikh",
    role: "company_admin",
    email: "admin@techcorp.com",
    companyPhone: "+1-555-0123",
    address: "123 Tech Street, Silicon Valley, CA 94000",
    city: "Silicon Valley",
    state: "CA",
    country: "USA",
    postalCode: "94000",
    isActive: true,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    website: "https://www.techcorp.com",
    industry: "Technology",
    size: "500",
    status: "Operational",
  },
  {
    id: "1",
    companyName: "TechCorp Solutions",
    email: "admin@techcorp.com",
    companyPhone: "+1-555-0123",
    firstName: "Salman",
    lastName: "Sheikh",
    role: "company_admin",
    address: "123 Tech Street, Silicon Valley, CA 94000",
    city: "Silicon Valley",
    state: "CA",
    country: "USA",
    postalCode: "94000",
    isActive: true,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    website: "https://www.techcorp.com",
    industry: "Technology",
    size: "500",
    status: "Operational",
  },
];

export function CompanyManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  const { data: companiesData, isLoading } = useGetAllCompaniesQuery();
  const [createCompany, { isLoading: isCreating }] = useSaveCompanyMutation();
  const [updateCompany, { isLoading: isUpdating }] = useUpdateCompanyMutation();
  const [deleteCompany, { isLoading: isDeleting }] = useDeleteCompanyMutation();

  const companies = companiesData || mockCompanies;

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      company.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && company.isActive) ||
      (statusFilter === "inactive" && !company.isActive);
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleCreateCompany = (data: CompanyPayload) => {
    createCompany(data);
  };

  const handleEditCompany = (data: UpdateCompanyPayload) => {
    updateCompany({
      id: selectedCompany!.id,
      data,
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Company Management
          </h1>
          <p className="text-muted-foreground">
            Manage all registered companies in the system
          </p>
        </div>
        <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add New Company
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Company</DialogTitle>
            </DialogHeader>
            <AddCompanyForm
              onClose={() => setShowCreateForm(false)}
              onSubmit={handleCreateCompany}
              isLoading={isCreating}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search companies by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Companies</SelectItem>
                <SelectItem value="active">Active Companies</SelectItem>
                <SelectItem value="inactive">Inactive Companies</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Company Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Companies
                </p>
                <p className="text-2xl font-bold">{companies.length}</p>
              </div>
              <Building2 className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Active Companies
                </p>
                <p className="text-2xl font-bold">
                  {companies.filter((c) => c.isActive).length}
                </p>
              </div>
              <Building2 className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Users
                </p>
                <p className="text-2xl font-bold">15</p>
              </div>
              <Users className="h-8 w-8 text-secondary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Test Assignments
                </p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <ClipboardList className="h-8 w-8 text-chart-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Company Listing */}
      <Tabs defaultValue="grid" className="space-y-4">
        <TabsList>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="space-y-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-3 bg-muted rounded"></div>
                      <div className="h-3 bg-muted rounded w-2/3"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCompanies.map((company, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">
                          {company.companyName}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={company.isActive ? "default" : "secondary"}
                          >
                            {company.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedCompany(company);
                            setShowEditForm(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteCompany(company.id)}
                          disabled={isDeleting}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="truncate">{company.email}</span>
                      </div>
                      {company.companyPhone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{company.companyPhone}</span>
                        </div>
                      )}
                      {company.address && (
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <span className="text-xs leading-relaxed">
                            {company.address}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 pt-4 border-t">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="text-center">
                          <div className="font-medium">0</div>
                          <div className="text-muted-foreground text-xs">
                            Users
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">{10}</div>
                          <div className="text-muted-foreground text-xs">
                            Tests
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground text-center">
                        Created: {formatDate(company.createdAt)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr className="text-left">
                      <th className="p-4 font-medium">Company Name</th>
                      <th className="p-4 font-medium">Status</th>
                      <th className="p-4 font-medium">Email</th>
                      <th className="p-4 font-medium">Users</th>
                      <th className="p-4 font-medium">Tests</th>
                      <th className="p-4 font-medium">Created</th>
                      <th className="p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCompanies.map((company) => (
                      <tr
                        key={company.id}
                        className="border-b hover:bg-muted/50"
                      >
                        <td className="p-4">
                          <div className="font-medium">
                            {company.companyName}
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge
                            variant={company.isActive ? "default" : "secondary"}
                          >
                            {company.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </td>
                        <td className="p-4">{company.email}</td>
                        <td className="p-4">{12}</td>
                        <td className="p-4">{10}</td>
                        {/* <td className="p-4">{company._count?.users || 0}</td>
                        <td className="p-4">
                          {company._count?.testAssignments || 0}
                        </td> */}
                        <td className="p-4">{formatDate(company.createdAt)}</td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedCompany(company);
                                setShowEditForm(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteCompany(company.id)}
                              disabled={isDeleting}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Company Dialog */}
      <Dialog open={showEditForm} onOpenChange={setShowEditForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Edit Company: {selectedCompany?.companyName}
            </DialogTitle>
          </DialogHeader>
          {selectedCompany && (
            <EditCompanyForm
              company={selectedCompany}
              onSubmit={handleEditCompany}
              onClose={() => setShowEditForm(false)}
              isLoading={isUpdating}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
