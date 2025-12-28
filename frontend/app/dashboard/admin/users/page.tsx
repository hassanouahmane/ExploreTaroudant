"use client"

import { useEffect, useState } from "react"
import { adminService } from "@/services/admin.service"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Search, 
  UserCheck, 
  UserX, 
  Trash2, 
  Loader2, 
  ShieldCheck, 
  Users 
} from "lucide-react"
import type { User, Status } from "@/lib/types"

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  // 1. Chargement initial de tous les utilisateurs
  const loadData = async () => {
    try {
      setLoading(true)
      const data = await adminService.getAllUsers()
      setUsers(data)
      setFilteredUsers(data)
    } catch (error) {
      toast({ title: "Erreur", description: "Échec du chargement", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  // 2. Filtrage en temps réel
  useEffect(() => {
    const filtered = users.filter(user => 
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredUsers(filtered)
  }, [searchTerm, users])

  // 3. Actions d'administration
  const handleToggleGuideStatus = async (id: number, currentStatus: Status) => {
    const newStatus = currentStatus === "ACTIVE" ? "SUSPENDED" : "ACTIVE"
    try {
      await adminService.updateGuideStatus(id, newStatus)
      toast({ title: "Statut mis à jour", description: `Le guide est maintenant ${newStatus}` })
      loadData()
    } catch (error) {
      toast({ title: "Erreur", variant: "destructive" })
    }
  }

  const handleDelete = async (id: number, role: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) return
    try {
      if (role === "GUIDE") await adminService.deleteGuide(id)
      else await adminService.deleteTourist(id)
      
      toast({ title: "Supprimé", description: "Utilisateur retiré avec succès" })
      loadData()
    } catch (error) {
      toast({ title: "Erreur de suppression", variant: "destructive" })
    }
  }

  if (loading) return <div className="flex h-[60vh] items-center justify-center"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Utilisateurs</h1>
          <p className="text-muted-foreground">Administrez les accès et rôles de la plateforme Explore Taroudant.</p>
        </div>
        
        {/* Barre de recherche temps réel */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Rechercher par nom ou email..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="all" className="gap-2"><Users size={16}/> Tous ({filteredUsers.length})</TabsTrigger>
          <TabsTrigger value="guides" className="gap-2"><ShieldCheck size={16}/> Guides ({filteredUsers.filter(u => u.role === "GUIDE").length})</TabsTrigger>
          <TabsTrigger value="tourists" className="gap-2"><UserCheck size={16}/> Touristes ({filteredUsers.filter(u => u.role === "TOURIST").length})</TabsTrigger>
        </TabsList>

        {/* Contenu commun pour les onglets via filtrage dynamique */}
        {["all", "guides", "tourists"].map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-6">
            <div className="rounded-md border bg-card">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date d'inscription</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers
                    .filter(u => tab === "all" || u.role === (tab === "guides" ? "GUIDE" : "TOURIST"))
                    .map((user) => (
                    <TableRow key={user.id} className="hover:bg-muted/20 transition-colors">
                      <TableCell>
                        <div className="font-medium">{user.fullName}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={user.role === 'ADMIN' ? 'border-red-500 text-red-500' : ''}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={user.status === 'ACTIVE' ? 'default' : user.status === 'PENDING' ? 'secondary' : 'destructive'}
                          className="capitalize"
                        >
                          {user.status.toLowerCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                      </TableCell>
                      <TableCell className="text-right flex justify-end gap-2">
                        {/* Actions spécifiques aux Guides */}
                        {user.role === "GUIDE" && (
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className={user.status === "ACTIVE" ? "text-amber-600" : "text-emerald-600"}
                            onClick={() => handleToggleGuideStatus(user.id, user.status)}
                          >
                            {user.status === "ACTIVE" ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                          </Button>
                        )}
                        
                        {/* Suppression */}
                        {user.role !== "ADMIN" && (
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-destructive hover:bg-destructive/10"
                            onClick={() => handleDelete(user.id, user.role)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredUsers.length === 0 && (
                <div className="p-10 text-center text-muted-foreground italic">
                  Aucun utilisateur trouvé.
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}