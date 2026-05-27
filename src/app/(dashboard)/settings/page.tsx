"use client";

import { Card } from "@/components/ui/card";
import { Settings, Shield, Globe, Bell } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Paramètres</h1>
        <p className="text-gray-400 text-sm mt-1">
          Configuration de votre salle
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500/10 rounded-xl">
              <Settings className="w-5 h-5 text-blue-400" />
            </div>
            <h2 className="text-lg font-semibold text-white">Général</h2>
          </div>
          <div className="space-y-3 text-sm text-gray-400">
            <div className="flex justify-between p-3 bg-gray-800/30 rounded-xl">
              <span>Nom de la salle</span>
              <span className="text-white">GameZone Cocody</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-800/30 rounded-xl">
              <span>Tarif horaire par défaut</span>
              <span className="text-white">500 FCFA</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-800/30 rounded-xl">
              <span>Devise</span>
              <span className="text-white">FCFA (XOF)</span>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-500/10 rounded-xl">
              <Shield className="w-5 h-5 text-purple-400" />
            </div>
            <h2 className="text-lg font-semibold text-white">Sécurité</h2>
          </div>
          <div className="space-y-3 text-sm text-gray-400">
            <div className="flex justify-between p-3 bg-gray-800/30 rounded-xl">
              <span>Authentification</span>
              <span className="text-green-400">Activée</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-800/30 rounded-xl">
              <span>Sessions JWT</span>
              <span className="text-green-400">Activées</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-800/30 rounded-xl">
              <span>Rôles</span>
              <span className="text-white">Admin / Employé</span>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-500/10 rounded-xl">
              <Globe className="w-5 h-5 text-green-400" />
            </div>
            <h2 className="text-lg font-semibold text-white">
              Paiements acceptés
            </h2>
          </div>
          <div className="space-y-3 text-sm text-gray-400">
            <div className="flex justify-between p-3 bg-gray-800/30 rounded-xl">
              <span>Espèces</span>
              <span className="text-green-400">Activé</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-800/30 rounded-xl">
              <span>Wave</span>
              <span className="text-green-400">Activé</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-800/30 rounded-xl">
              <span>Orange Money</span>
              <span className="text-green-400">Activé</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-800/30 rounded-xl">
              <span>MTN Money</span>
              <span className="text-green-400">Activé</span>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-yellow-500/10 rounded-xl">
              <Bell className="w-5 h-5 text-yellow-400" />
            </div>
            <h2 className="text-lg font-semibold text-white">
              Notifications
            </h2>
          </div>
          <div className="space-y-3 text-sm text-gray-400">
            <div className="flex justify-between p-3 bg-gray-800/30 rounded-xl">
              <span>Fin de session</span>
              <span className="text-green-400">Activées</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-800/30 rounded-xl">
              <span>Machine inactive</span>
              <span className="text-green-400">Activées</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-800/30 rounded-xl">
              <span>Alertes système</span>
              <span className="text-green-400">Activées</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
