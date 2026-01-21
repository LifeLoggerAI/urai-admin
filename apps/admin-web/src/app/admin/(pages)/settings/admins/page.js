'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var table_1 = require("@/components/ui/table");
var select_1 = require("@/components/ui/select");
var lucide_react_1 = require("lucide-react");
var withAuth_1 = require("@/components/withAuth");
var adminUsers = [
    { id: 'adm_001', name: 'Jane Smith', email: 'jane.smith@example.com', role: 'super_admin', createdAt: '2023-01-15' },
    { id: 'adm_002', name: 'John Doe', email: 'john.doe@example.com', role: 'admin', createdAt: '2023-03-22' },
    { id: 'adm_003', name: 'Peter Jones', email: 'peter.jones@example.com', role: 'support', createdAt: '2023-08-10' },
];
function AdminManagementPage() {
    return (<div className="p-4 sm:p-6 md:p-8">
      <h1 className="text-2xl font-bold mb-4">Admin User Management</h1>
      <card_1.Card className="bg-gray-800/50 border-gray-700 text-white">
        <card_1.CardHeader>
            <card_1.CardTitle>All Administrators</card_1.CardTitle>
             <div className="flex items-center space-x-2 pt-4">
                <div className="relative flex-grow">
                    <lucide_react_1.Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"/>
                    <input_1.Input placeholder="Search by name or email" className="pl-8 bg-gray-900 border-gray-700"/>
                </div>
                <button_1.Button><lucide_react_1.UserPlus className="mr-2 h-4 w-4"/> Add New Admin</button_1.Button>
            </div>
        </card_1.CardHeader>
        <card_1.CardContent>
          <table_1.Table>
            <table_1.TableHeader>
              <table_1.TableRow>
                <table_1.TableHead>Name</table_1.TableHead>
                <table_1.TableHead>Email</table_1.TableHead>
                <table_1.TableHead>Role</table_1.TableHead>
                <table_1.TableHead>Created At</table_1.TableHead>
                <table_1.TableHead>Actions</table_1.TableHead>
              </table_1.TableRow>
            </table_1.TableHeader>
            <table_1.TableBody>
              {adminUsers.map(function (user) { return (<table_1.TableRow key={user.id}>
                  <table_1.TableCell>{user.name}</table_1.TableCell>
                  <table_1.TableCell>{user.email}</table_1.TableCell>
                  <table_1.TableCell>
                    <select_1.Select value={user.role}>
                      <select_1.SelectTrigger className="w-[120px] bg-gray-900 border-gray-700">
                        <select_1.SelectValue />
                      </select_1.SelectTrigger>
                      <select_1.SelectContent>
                        <select_1.SelectItem value="super_admin">Super Admin</select_1.SelectItem>
                        <select_1.SelectItem value="admin">Admin</select_1.SelectItem>
                        <select_1.SelectItem value="analyst">Analyst</select_1.SelectItem>
                        <select_1.SelectItem value="moderator">Moderator</select_1.SelectItem>
                        <select_1.SelectItem value="support">Support</select_1.SelectItem>
                         <select_1.SelectItem value="viewer">Viewer</select_1.SelectItem>
                      </select_1.SelectContent>
                    </select_1.Select>
                  </table_1.TableCell>
                  <table_1.TableCell>{user.createdAt}</table_1.TableCell>
                  <table_1.TableCell>
                    <button_1.Button variant="destructive" size="sm">Remove</button_1.Button>
                  </table_1.TableCell>
                </table_1.TableRow>); })}
            </table_1.TableBody>
          </table_1.Table>
        </card_1.CardContent>
      </card_1.Card>
    </div>);
}
exports.default = (0, withAuth_1.default)(AdminManagementPage, ['super_admin']);
