'use client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Link, Home, FileText, CheckSquare, Users, Briefcase, Settings, LogOut, Menu } from 'lucide-react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { RoleName } from '@/types';

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
    const { user, logout, hasRole } = useAuth();
    const pathname = usePathname();

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: Home, show: true },
        { name: 'My Reports', href: '/reports', icon: FileText, show: true },
        { name: 'Manager Dashboard', href: '/manager/dashboard', icon: CheckSquare, show: hasRole([RoleName.MANAGER, RoleName.ADMIN]) },
        { name: 'Projects', href: '/projects', icon: Briefcase, show: hasRole([RoleName.MANAGER, RoleName.ADMIN, RoleName.TEAM_MEMBER]) },
        { name: 'Users', href: '/admin/users', icon: Users, show: hasRole([RoleName.ADMIN]) },
    ];

    const NavLinks = () => (
        <div className="space-y-1">
            {navigation.filter(n => n.show).map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                    <NextLink key={item.name} href={item.href}>
                        <span
                            className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${isActive
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                }`}
                        >
                            <item.icon className="mr-3 h-5 w-5" />
                            {item.name}
                        </span>
                    </NextLink>
                );
            })}
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row shadow-sm">
            {/* Mobile Sidebar */}
            <div className="md:hidden flex items-center justify-between p-4 bg-white border-b">
                <div className="text-xl font-bold text-primary">ReportGen</div>
                <Sheet>
                    <SheetTrigger render={<Button variant="outline" size="icon" />}>
                        <Menu className="h-5 w-5" />
                    </SheetTrigger>
                    <SheetContent side="left" className="w-64">
                        <div className="mt-8 space-y-4">
                            <NavLinks />
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden md:flex w-64 flex-col bg-white border-r">
                <div className="h-16 flex items-center px-6 border-b">
                    <span className="text-xl font-bold text-primary">ReportGen</span>
                </div>
                <div className="flex-1 overflow-y-auto py-4 px-3">
                    <NavLinks />
                </div>
                <div className="p-4 border-t flex flex-col space-y-3">
                    <NextLink href="/profile">
                        <div className="flex items-center space-x-3 cursor-pointer p-2 rounded hover:bg-muted/50">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={user?.avatarUrl || ''} />
                                <AvatarFallback>{user?.fullName?.charAt(0) || 'U'}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium">{user?.fullName}</span>
                                <span className="text-xs text-muted-foreground">{user?.role?.name}</span>
                            </div>
                        </div>
                    </NextLink>
                    <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50" onClick={logout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-hidden flex flex-col">
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};
