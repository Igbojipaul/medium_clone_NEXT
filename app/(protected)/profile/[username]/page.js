// app/profile/[username]/page.jsx
"use client";

import { useRef, useState } from "react";
import { useParams } from "next/navigation";
import useSWR from "swr";
import api from "@/lib/api";
import PostCard from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Camera,
  CheckCircle,
  CheckCircle2,
  Pen,
  Plus,
  Search,
  User as UserIcon,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/app/providers/AuthProvider";

const fetcher = (url) => api.get(url).then((res) => res.data);

export default function ProfilePage() {
  const { username } = useParams();
  const { user: currentUser, setUser } = useAuth();

  // Profile data
  const {
    data: profile,
    error: profErr,
    mutate: mutateProfile,
  } = useSWR(`/profiles/${username}/`, fetcher);

  // User’s posts
  const { data: posts, error: postsErr } = useSWR(
    `/posts?author=${encodeURIComponent(username)}&limit=100`,
    fetcher
  );

  console.log(profile);

  const [loadingFollow, setLoadingFollow] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch followers/following lists when modal opens
  const { data: followersList, error: followersErr } = useSWR(
    showFollowers ? `/profiles/${username}/followers/` : null,
    fetcher
  );
  const { data: followingList, error: followingErr } = useSWR(
    showFollowing ? `/profiles/${username}/following/` : null,
    fetcher
  );

  const filteredFollowers = followersList?.filter((user) =>
    user.username.toLowerCase().includes(searchQuery?.toLowerCase())
  );

  const filteredFollowing = followingList?.filter((user) =>
    user.username.toLowerCase().includes(searchQuery?.toLowerCase())
  );

  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  if (profErr)
    return <div className="p-8 text-red-500">Failed to load profile.</div>;
  if (!profile) return <div className="p-8">Loading profile…</div>;

  const isOwnProfile = currentUser?.username === username;

  const onSelectImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    setUploadingImage(true);
    try {
      const { data: updatedUser } = await api.put("/user/", formData);
      setUser(updatedUser);
      mutateProfile();
    } catch (err) {
      console.error("Failed to upload profile image:", err.res?.data);
      alert("Failed to upload image");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  const handleFollow = async () => {
    setLoadingFollow(true);
    try {
      if (profile.following) {
        // assuming DELETE at /profiles/[username]/follow/
        await api.delete(`/profiles/${username}/unfollow/`);
      } else {
        await api.post(`/profiles/${username}/follow/`);
      }
      mutateProfile();
    } catch {
      // optional: show error toast
    } finally {
      setLoadingFollow(false);
    }
  };

  return (
    <>
      <main className="max-w-3xl mx-auto p-6">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 mb-6">
          <div className="relative">
            {profile.image ? (
              <Image
                src={profile.image}
                className="w-20 h-20 rounded-full object-cover"
                alt={profile.username}
                width={80}
                height={80}
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                <UserIcon className="w-8 h-8 text-gray-500" />
              </div>
            )}
            {isOwnProfile && (
              <button
                type="button"
                onClick={onSelectImage}
                className="absolute bottom-0 right-0 bg-white border border-gray-300 rounded-full p-1 hover:bg-gray-100"
                title="Change profile picture"
              >
                <Camera className="w-4 h-4 text-gray-600" />
              </button>
            )}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageChange}
            />
            {uploadingImage && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-full">
                <div className="w-5 h-5 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <h1 className="text-2xl font-semibold">{profile.username}</h1>
            {profile.bio && <p className="text-gray-600 mt-1">{profile.bio}</p>}
            <div className="flex space-x-6 mt-2 text-sm text-gray-700">
              <button
                onClick={() => {
                  /* open following modal */
                }}
                className="hover:underline"
              >
                <strong>{profile.following_count}</strong> Following
              </button>
              <button
                onClick={() => {
                  /* open followers modal */
                }}
                className="hover:underline"
              >
                <strong>{profile.follower_count}</strong> Followers
              </button>
            </div>
          </div>

          {!isOwnProfile && (
            <Button
              variant={profile.following ? "outline" : "default"}
              onClick={handleFollow}
              disabled={loadingFollow}
              className="ml-auto"
            >
              {loadingFollow
                ? "..."
                : profile.following
                ? "Unfollow"
                : "Follow"}
            </Button>
          )}
        </div>

        {/* User's Posts */}
        <h2 className="text-2xl font-bold mb-4">Posts by {profile.username}</h2>
        {postsErr && <p className="text-red-500">Failed to load posts.</p>}
        {!posts ? (
          <p>Loading posts…</p>
        ) : posts.results.length === 0 ? (
          <div>
            <p className="text-gray-600">No posts yet.</p>
            <Link href="/editor">
              <p className="flex gap-3 mt-20 items-center justify-center font-semi-bold text-2xl text-gray-700 hover:text-gray-900 transition">
                <Pen /> Click to start writing
              </p>
            </Link>
          </div>
        ) : (
          posts.results.map((post) => <PostCard key={post.slug} post={post} />)
        )}
      </main>

      {/* Followers Modal */}
      {showFollowers && (
        <Modal
          title={`Users following by ${profile.username}`}
          onClose={() => setShowFollowers(false)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        >
          {followingErr && (
            <p className="text-red-500">Failed to load followers list.</p>
          )}
          {!followersList ? (
            <p>Loading...</p>
          ) : followersList.length === 0 ? (
            <p className="text-gray-600">Not following by anyone yet.</p>
          ) : (
            <div className="p-2">
              {filteredFollowers.map((user, id) => (
                <div
                  key={user.username + id}
                  className="flex items-center p-3 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <div className="relative">
                    {user.image ? (
                      <Image
                        src={user?.image}
                        alt={user?.username}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full object-cover">
                        <UserIcon className="w-8 h-8 text-gray-500" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 ml-3 min-w-0">
                    <div className="flex items-center gap-1">
                      <p className="font-semibold text-gray-900 truncate">
                        {user.username}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      @{user.username}
                    </p>
                    <p className="text-xs text-gray-400 truncate mt-1">
                      {user.bio}
                    </p>
                  </div>

                  {/* this button was commented because user is a user object  and not a profile object */}
                  {/* <button
                    onClick={()=> advancedFollow(user)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                      user.following
                        ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        : "bg-gray-900 text-white hover:bg-gray-800"
                    }`}
                  >
                    {user.following ? "Following" : "Follow"}
                  </button> */}
                </div>
              ))}
            </div>
          )}
        </Modal>
      )}

      {/* Following Modal */}
      {showFollowing && (
        <Modal
          title={`Users followed by ${profile.username}`}
          onClose={() => setShowFollowing(false)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        >
          {followingErr && (
            <p className="text-red-500">Failed to load following list.</p>
          )}
          {!followingList ? (
            <p>Loading...</p>
          ) : followingList.length === 0 ? (
            <p className="text-gray-600">Not following anyone yet.</p>
          ) : (
            <div className="p-2">
              {filteredFollowing.map((user, id) => (
                <div
                  key={user.username + id}
                  className="flex items-center p-3 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <div className="relative">
                    {user.image ? (
                      <Image
                        src={user?.image}
                        alt={user?.username}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full object-cover">
                        <UserIcon className="w-8 h-8 text-gray-500" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 ml-3 min-w-0">
                    <div className="flex items-center gap-1">
                      <p className="font-semibold text-gray-900 truncate">
                        {user.username}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      @{user.username}
                    </p>
                    <p className="text-xs text-gray-400 truncate mt-1">
                      {user.bio}
                    </p>
                  </div>

                  {/* this butto nwas commented because user is a user object  and not a profile object */}
                  {/* <button
                    onClick={()=> advancedFollow(user)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                      user.following
                        ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        : "bg-gray-900 text-white hover:bg-gray-800"
                    }`}
                  >
                    {user.following ? "Following" : "Follow"}
                  </button> */}
                </div>
              ))}
            </div>
          )}
        </Modal>
      )}
    </>
  );
}

function Modal({ title, onClose, children, searchQuery, setSearchQuery }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col shadow-2xl overflow-auto scroll-mt-8">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        {/* Search */}
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
