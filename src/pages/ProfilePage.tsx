import { useState } from "react";
import { User, Package, Heart, MapPin, CreditCard, LogOut, ChevronRight, Edit2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/context/AuthContext";
import { useMyOrders } from "@/hooks/useApi";
import { api } from "@/lib/api";

const ProfilePage = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [saving, setSaving]       = useState(false);
  const [saved, setSaved]         = useState(false);

  const { data: ordersData, isLoading: ordersLoading } = useMyOrders();
  const orders = ordersData?.data || [];

  const [form, setForm] = useState({
    firstName: user?.firstName || "",
    lastName:  user?.lastName  || "",
    phone:     user?.phone     || "",
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.put<{ data: typeof user }>("/auth/me", form);
      updateUser(res.data as typeof user);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      // toast on error ideally
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => { logout(); navigate("/"); };

  const menuItems = [
    { id: "profile",   label: "My Profile",        icon: User                                   },
    { id: "orders",    label: "My Orders",          icon: Package                                },
    { id: "wishlist",  label: "Wishlist",           icon: Heart,   link: "/wishlist"             },
    { id: "addresses", label: "Saved Addresses",   icon: MapPin                                  },
  ];

  const statusColor = (s: string) =>
    s === "delivered" ? "bg-green-100 text-green-700" :
    s === "cancelled" ? "bg-red-100 text-red-700" :
    "bg-brand-pink-light text-primary";

  if (!user) {
    return (
      <Layout>
        <div className="section-padding text-center py-20">
          <p className="text-muted-foreground mb-4">Please sign in to view your profile.</p>
          <Link to="/auth" className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:opacity-90">
            Sign In
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="section-padding max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
          My Account
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="space-y-1">
            <div className="bg-brand-pink-light rounded-xl p-4 mb-4 text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto text-2xl font-bold mb-2">
                {user.firstName[0]?.toUpperCase()}
              </div>
              <p className="font-bold text-foreground">{user.firstName} {user.lastName}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>

            {menuItems.map(item =>
              item.link ? (
                <Link key={item.id} to={item.link}
                  className="flex items-center gap-3 p-3 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors">
                  <item.icon size={18} /> {item.label} <ChevronRight size={14} className="ml-auto" />
                </Link>
              ) : (
                <button key={item.id} onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === item.id ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
                  }`}>
                  <item.icon size={18} /> {item.label}
                </button>
              )
            )}

            <button onClick={handleLogout}
              className="w-full flex items-center gap-3 p-3 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors mt-4">
              <LogOut size={18} /> Sign Out
            </button>
          </aside>

          {/* Main Panel */}
          <div className="md:col-span-3 bg-card border border-border rounded-xl p-6">

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div>
                <h2 className="text-xl font-bold text-foreground mb-6">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">First Name</label>
                    <input type="text" value={form.firstName}
                      onChange={e => setForm(p => ({ ...p, firstName: e.target.value }))}
                      className="w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-background text-foreground mt-1 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Last Name</label>
                    <input type="text" value={form.lastName}
                      onChange={e => setForm(p => ({ ...p, lastName: e.target.value }))}
                      className="w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-background text-foreground mt-1 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <input type="email" value={user.email} disabled
                      className="w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-muted text-muted-foreground mt-1 cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Phone</label>
                    <input type="tel" value={form.phone}
                      onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                      className="w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-background text-foreground mt-1 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                  </div>
                </div>
                <button onClick={handleSave} disabled={saving}
                  className="mt-6 bg-primary text-primary-foreground font-bold px-8 py-3 rounded-xl hover:opacity-90 disabled:opacity-60 transition-opacity">
                  {saving ? "Saving..." : saved ? "✓ Saved!" : "Save Changes"}
                </button>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div>
                <h2 className="text-xl font-bold text-foreground mb-6">My Orders</h2>
                {ordersLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => <div key={i} className="h-20 bg-muted animate-pulse rounded-xl" />)}
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package size={40} className="text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">No orders yet.</p>
                    <Link to="/products" className="mt-3 inline-block text-primary font-semibold hover:underline">Start Shopping</Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.map(order => (
                      <div key={order._id} className="flex items-center justify-between p-4 border border-border rounded-xl">
                        <div>
                          <p className="font-semibold text-foreground">{order.orderId}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                            {" · "}{order.items.length} item{order.items.length > 1 ? "s" : ""}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-foreground">₹{order.total.toLocaleString()}</p>
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${statusColor(order.orderStatus)}`}>
                            {order.orderStatus}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === "addresses" && (
              <div>
                <h2 className="text-xl font-bold text-foreground mb-6">Saved Addresses</h2>
                {user.addresses?.length === 0 ? (
                  <p className="text-muted-foreground mb-4">No saved addresses yet.</p>
                ) : (
                  <div className="space-y-3 mb-4">
                    {user.addresses?.map((addr) => (
                      <div key={addr._id} className="border border-border rounded-xl p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-xs font-bold bg-primary text-primary-foreground px-2 py-0.5 rounded">{addr.label}</span>
                            <p className="font-medium text-foreground mt-2">{addr.name}</p>
                            <p className="text-sm text-muted-foreground mt-1">{addr.line1}, {addr.city}, {addr.state} – {addr.pincode}</p>
                            <p className="text-sm text-muted-foreground">Phone: {addr.phone}</p>
                          </div>
                          {addr.isDefault && (
                            <span className="text-xs text-green-600 font-semibold">Default</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <button className="w-full border-2 border-dashed border-border rounded-xl p-4 text-muted-foreground hover:border-primary hover:text-primary transition-colors text-sm font-medium">
                  + Add New Address
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
