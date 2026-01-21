'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var table_1 = require("@/components/ui/table");
var select_1 = require("@/components/ui/select");
var badge_1 = require("@/components/ui/badge");
var avatar_1 = require("@/components/ui/avatar");
var UserDetailPanel_1 = require("@/components/UserDetailPanel");
var lucide_react_1 = require("lucide-react");
var withAuth_1 = require("@/components/withAuth");
var users = [
    { id: 'usr_001', name: 'Alice Johnson', email: 'alice.j@example.com', role: 'viewer', status: 'active', lastActive: '2 hours ago', createdAt: '2023-01-10', avatarUrl: '' },
    { id: 'usr_002', name: 'Bob Williams', email: 'bob.w@example.com', role: 'support', status: 'active', lastActive: '5 hours ago', createdAt: '2023-02-20', avatarUrl: '' },
    { id: 'usr_003', name: 'Charlie Brown', email: 'charlie.b@example.com', role: 'moderator', status: 'suspended', lastActive: '3 days ago', createdAt: '2023-03-15', avatarUrl: '' },
    { id: 'usr_004', name: 'Diana Prince', email: 'diana.p@example.com', role: 'admin', status: 'shadow-banned', lastActive: '1 week ago', createdAt: '2022-11-05', avatarUrl: '' },
];
function UsersPage() {
    var _a = (0, react_1.useState)(null), selectedUser = _a[0], setSelectedUser = _a[1];
    var _b = (0, react_1.useState)(false), isPanelOpen = _b[0], setIsPanelOpen = _b[1];
    var handleUserSelect = function (user) {
        setSelectedUser(user);
        setIsPanelOpen(true);
    };
    var handlePanelClose = function () {
        setIsPanelOpen(false);
        // Delay clearing the user to allow the panel to animate out smoothly
        setTimeout(function () {
            setSelectedUser(null);
        }, 300);
    };
    return (<>
      <div className="p-4 sm:p-6 md:p-8">
        <h1 className="text-2xl font-bold mb-4 text-white">User Management</h1>
        <card_1.Card className="bg-gray-800/50 border-gray-700 text-white">
          <card_1.CardHeader>
              <div className="flex items-center justify-between">
                <card_1.CardTitle>All Users</card_1.CardTitle>
                <div className="flex items-center space-x-2">
                    <div className="relative flex-grow">
                        <lucide_react_1.Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"/>
                        <input_1.Input placeholder="Search by name or email" className="pl-8 bg-gray-900 border-gray-700"/>
                    </div>
                    <select_1.Select>
                        <select_1.SelectTrigger className="w-[180px] bg-gray-900 border-gray-700">
                            <lucide_react_1.SlidersHorizontal className="mr-2 h-4 w-4"/>
                            <select_1.SelectValue placeholder="Filter by status"/>
                        </select_1.SelectTrigger>
                        <select_1.SelectContent>
                            <select_1.SelectItem value="all">All Statuses</select_1.SelectItem>
                            <select_1.SelectItem value="active">Active</select_1.SelectItem>
                            <select_1.SelectItem value="suspended">Suspended</select_1.SelectItem>
                            <select_1.SelectItem value="shadow-banned">Shadow-Banned</select_1.SelectItem>
                        </select_1.SelectContent>
                    </select_1.Select>
                 </div>
              </div>
          </card_1.CardHeader>
          <card_1.CardContent>
            <table_1.Table>
              <table_1.TableHeader>
                <table_1.TableRow className="border-gray-700">
                  <table_1.TableHead className="text-gray-400">User</table_1.TableHead>
                  <table_1.TableHead className="text-gray-400">Status</table_1.TableHead>
                  <table_1.TableHead className="text-gray-400">Role</table_1.TableHead>
                  <table_1.TableHead className="text-gray-400">Last Active</table_1.TableHead>
                  <table_1.TableHead className="text-right text-gray-400">Actions</table_1.TableHead>
                </table_1.TableRow>
              </table_1.TableHeader>
              <table_1.TableBody>
                {users.map(function (user) { return (<table_1.TableRow key={user.id} className="border-gray-700">
                    <table_1.TableCell>
                        <div className="flex items-center space-x-3">
                            <avatar_1.Avatar>
                                <avatar_1.AvatarImage src={user.avatarUrl}/>
                                <avatar_1.AvatarFallback>{user.name.charAt(0)}</avatar_1.AvatarFallback>
                            </avatar_1.Avatar>
                            <div>
                                <div className="font-medium">{user.name}</div>
                                <div className="text-sm text-gray-400">{user.email}</div>
                            </div>
                        </div>
                    </table_1.TableCell>
                    <table_1.TableCell>
                        <badge_1.Badge variant={user.status === 'active' ? 'default' : 'destructive'}>{user.status}</badge_1.Badge>
                    </table_1.TableCell>
                    <table_1.TableCell>{user.role}</table_1.TableCell>
                    <table_1.TableCell>{user.lastActive}</table_1.TableCell>
                    <table_1.TableCell className="text-right">
                      <button_1.Button variant="outline" size="sm" onClick={function () { return handleUserSelect(user); }}>
                        View Details
                      </button_1.Button>
                    </table_1.TableCell>
                  </table_1.TableRow>); })}
              </table_1.TableBody>
            </table_1.Table>
          </card_1.CardContent>
        </card_1.Card>
      </div>
      <UserDetailPanel_1.UserDetailPanel user={selectedUser} isOpen={isPanelOpen} onOpenChange={handlePanelClose}/>
    </>);
}
exports.default = (0, withAuth_1.default)(UsersPage, ['super_admin', 'admin', 'moderator', 'support', 'viewer']);
