"use client";

import { useState } from "react";
import { useApi, apiPost, apiPatch, apiDelete } from "@/hooks/useApi";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Plus,
  UserCheck,
  UserX,
  Edit,
  Mail,
  Calendar,
  Activity,
} from "lucide-react";
import { motion } from "framer-motion";
import { formatDate } from "@/lib/utils";

interface Employee {
  id: string;
  email: string;
  name: string;
  role: string;
  active: boolean;
  createdAt: string;
  _count: {
    sessions: number;
    payments: number;
  };
}

export default function EmployeesPage() {
  const {
    data: employees,
    loading,
    refetch,
  } = useApi<Employee[]>("/api/employees");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await apiPost("/api/employees", formData);
      setShowAddModal(false);
      setFormData({ name: "", email: "", password: "" });
      refetch();
    } catch {
      // Error handled silently
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployee) return;
    setFormLoading(true);
    try {
      await apiPatch(`/api/employees/${selectedEmployee.id}`, {
        name: formData.name,
        email: formData.email,
      });
      setShowEditModal(false);
      refetch();
    } catch {
      // Error handled silently
    } finally {
      setFormLoading(false);
    }
  };

  const handleToggleActive = async (employee: Employee) => {
    try {
      if (employee.active) {
        await apiDelete(`/api/employees/${employee.id}`);
      } else {
        await apiPatch(`/api/employees/${employee.id}`, { active: true });
      }
      refetch();
    } catch {
      // Error handled silently
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-800 rounded-lg w-48 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-48 bg-gray-900/50 border border-gray-800 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Employés</h1>
          <p className="text-gray-400 text-sm mt-1">
            Gérez votre équipe
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4" />
          Ajouter un employé
        </Button>
      </div>

      {/* Employees grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {employees?.length === 0 ? (
          <Card className="col-span-full text-center py-12">
            <Users className="w-12 h-12 mx-auto text-gray-600 mb-3" />
            <p className="text-gray-400">Aucun employé</p>
            <p className="text-gray-500 text-sm mt-1">
              Ajoutez votre premier employé pour commencer
            </p>
          </Card>
        ) : (
          employees?.map((employee, i) => (
            <motion.div
              key={employee.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className={!employee.active ? "opacity-60" : ""}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                      {employee.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">
                        {employee.name}
                      </h3>
                      <Badge
                        variant={employee.active ? "success" : "danger"}
                      >
                        {employee.active ? "Actif" : "Inactif"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Mail className="w-4 h-4" />
                    {employee.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Calendar className="w-4 h-4" />
                    Depuis {formatDate(employee.createdAt)}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Activity className="w-4 h-4" />
                    {employee._count.sessions} sessions &bull;{" "}
                    {employee._count.payments} paiements
                  </div>
                </div>

                <div className="flex gap-2 pt-3 border-t border-gray-800">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setSelectedEmployee(employee);
                      setFormData({
                        name: employee.name,
                        email: employee.email,
                        password: "",
                      });
                      setShowEditModal(true);
                    }}
                  >
                    <Edit className="w-3.5 h-3.5" />
                    Modifier
                  </Button>
                  <Button
                    size="sm"
                    variant={employee.active ? "danger" : "success"}
                    onClick={() => handleToggleActive(employee)}
                  >
                    {employee.active ? (
                      <>
                        <UserX className="w-3.5 h-3.5" />
                        Désactiver
                      </>
                    ) : (
                      <>
                        <UserCheck className="w-3.5 h-3.5" />
                        Activer
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Add Employee Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Ajouter un employé"
      >
        <form onSubmit={handleAdd} className="space-y-4">
          <Input
            label="Nom complet"
            placeholder="Moussa Koné"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            required
          />
          <Input
            label="Email"
            type="email"
            placeholder="moussa@gamezone.ci"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
          <Input
            label="Mot de passe"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />
          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={() => setShowAddModal(false)}
              type="button"
              className="flex-1"
            >
              Annuler
            </Button>
            <Button type="submit" loading={formLoading} className="flex-1">
              Ajouter
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Employee Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Modifier l'employé"
      >
        <form onSubmit={handleEdit} className="space-y-4">
          <Input
            label="Nom complet"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            required
          />
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={() => setShowEditModal(false)}
              type="button"
              className="flex-1"
            >
              Annuler
            </Button>
            <Button type="submit" loading={formLoading} className="flex-1">
              Enregistrer
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
