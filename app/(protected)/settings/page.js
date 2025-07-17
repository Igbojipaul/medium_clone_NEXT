"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import api from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, User, Mail, FileText, Image as ImageIcon, Lock, Shield, AlertCircle, CheckCircle } from "lucide-react";

const fetcher = (url) => api.get(url).then((res) => res.data);

export default function SettingsPage() {
  const router = useRouter();
  const { data: user, error, mutate } = useSWR("/api/user/", fetcher);
  
  const [profileForm, setProfileForm] = useState({
    username: "",
    email: "",
    bio: "",
    image: null,
  });
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState({
    profile: false,
    password: false,
  });

  // Prefill once user data loads
  useEffect(() => {
    if (user) {
      setProfileForm({
        username: user.username,
        email: user.email,
        bio: user.bio || "",
        image: user.image || null,
      });
    }
  }, [user]);

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <Alert className="max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Failed to load settings. Please try again.</AlertDescription>
      </Alert>
    </div>
  );
  
  if (!user) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading your settings...</p>
      </div>
    </div>
  );

  const handleProfileChange = (e) => {
    setProfileForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    // Clear error for this field
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: "" }));
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    // Clear error for this field
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: "" }));
    }
  };

  const validatePasswordForm = () => {
    const newErrors = {};
    
    if (!passwordForm.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }
    
    if (!passwordForm.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (passwordForm.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    return newErrors;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(prev => ({ ...prev, profile: true }));
    setErrors({});
    setSuccess("");

    try {
      await api.put("/api/user/", profileForm);
      mutate();
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      const resp = err.response?.data;
      setErrors({
        profile: resp?.errors
          ? Object.values(resp.errors).flat().join(" ")
          : resp?.detail || err.message
      });
    } finally {
      setLoading(prev => ({ ...prev, profile: false }));
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(prev => ({ ...prev, password: true }));
    setErrors({});
    setSuccess("");

    const validationErrors = validatePasswordForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(prev => ({ ...prev, password: false }));
      return;
    }

    try {
      await api.put("/api/user/password/", {
        current_password: passwordForm.currentPassword,
        new_password: passwordForm.newPassword,
      });
      
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setSuccess("Password updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      const resp = err.response?.data;
      setErrors({
        password: resp?.errors
          ? Object.values(resp.errors).flat().join(" ")
          : resp?.detail || err.message
      });
    } finally {
      setLoading(prev => ({ ...prev, password: false }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const getUserInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-2 bg-gray-100 dark:bg-gray-900 rounded-lg">
              <User className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Account Settings</h1>
              <p className="text-gray-600 dark:text-gray-400">Manage your profile and security settings</p>
            </div>
          </div>
          
          {success && (
            <Alert className="mb-4 border-green-200 bg-green-50 dark:bg-green-900/20">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 dark:text-green-400">{success}</AlertDescription>
            </Alert>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile Section */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <CardTitle className="text-xl">Profile Information</CardTitle>
                    <CardDescription>Update your personal details and profile image</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {errors.profile && (
                  <Alert className="mb-4 border-red-200 bg-red-50 dark:bg-red-900/20">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800 dark:text-red-400">{errors.profile}</AlertDescription>
                  </Alert>
                )}
                
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Username
                      </label>
                      <Input
                        name="username"
                        value={profileForm.username}
                        onChange={handleProfileChange}
                        className="transition-all duration-200 focus:ring-2 focus:ring-gray-500"
                        placeholder="Enter your username"
                      />
                      {errors.username && <p className="text-sm text-red-600">{errors.username}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email
                      </label>
                      <Input
                        name="email"
                        type="email"
                        value={profileForm.email}
                        onChange={handleProfileChange}
                        className="transition-all duration-200 focus:ring-2 focus:ring-gray-500"
                        placeholder="Enter your email"
                      />
                      {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                    </div>
                  </div>
                  
          
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Bio
                    </label>
                    <Textarea
                      name="bio"
                      value={profileForm.bio}
                      onChange={handleProfileChange}
                      className="transition-all duration-200 focus:ring-2 focus:ring-gray-500 min-h-[100px]"
                      placeholder="Tell us about yourself..."
                    />
                    {errors.bio && <p className="text-sm text-red-600">{errors.bio}</p>}
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={loading.profile}
                    className="w-full bg-gray-600 hover:bg-gray-700 transition-colors duration-200"
                  >
                    {loading.profile ? "Updating..." : "Update Profile"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Password Section */}
            {/*<Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm mt-6">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-red-600 dark:text-red-400" />
                  <div>
                    <CardTitle className="text-xl">Change Password</CardTitle>
                    <CardDescription>Update your password to keep your account secure</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {errors.password && (
                  <Alert className="mb-4 border-red-200 bg-red-50 dark:bg-red-900/20">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800 dark:text-red-400">{errors.password}</AlertDescription>
                  </Alert>
                )}
                
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Current Password
                    </label>
                    <div className="relative">
                      <Input
                        name="currentPassword"
                        type={showPasswords.current ? "text" : "password"}
                        value={passwordForm.currentPassword}
                        onChange={handlePasswordChange}
                        className="transition-all duration-200 focus:ring-2 focus:ring-gray-500 pr-10"
                        placeholder="Enter your current password"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('current')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.currentPassword && <p className="text-sm text-red-600">{errors.currentPassword}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      New Password
                    </label>
                    <div className="relative">
                      <Input
                        name="newPassword"
                        type={showPasswords.new ? "text" : "password"}
                        value={passwordForm.newPassword}
                        onChange={handlePasswordChange}
                        className="transition-all duration-200 focus:ring-2 focus:ring-gray-500 pr-10"
                        placeholder="Enter your new password"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('new')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.newPassword && <p className="text-sm text-red-600">{errors.newPassword}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Input
                        name="confirmPassword"
                        type={showPasswords.confirm ? "text" : "password"}
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordChange}
                        className="transition-all duration-200 focus:ring-2 focus:ring-gray-500 pr-10"
                        placeholder="Confirm your new password"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('confirm')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword}</p>}
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={loading.password}
                    className="w-full bg-red-600 hover:bg-red-700 transition-colors duration-200"
                  >
                    {loading.password ? "Updating..." : "Change Password"}
                  </Button>
                </form>
              </CardContent>
            </Card>*/}
          </div>

          {/* Profile Preview Sidebar */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm sticky top-8">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-lg">Profile Preview</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
                    <AvatarImage src={profileForm.image} alt={profileForm.username} />
                    <AvatarFallback className="text-lg font-semibold bg-gradient-to-r from-gray-500 to-purple-600 text-white">
                      {getUserInitials(profileForm.username)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                      {profileForm.username || 'Username'}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {profileForm.email || 'email@example.com'}
                    </p>
                    {profileForm.bio && (
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        {profileForm.bio}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2 justify-center mt-4">
                    <Badge variant="secondary" className="text-xs">
                      Member since {new Date(user.created_at || Date.now()).getFullYear()}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}