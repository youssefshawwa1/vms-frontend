import { useState, useEffect } from "react";
import api from "../api/axios";
import {
  Person,
  Email,
  Badge,
  CalendarToday,
  Edit,
  Security,
  VerifiedUser,
  WorkspacePremium,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { Avatar, Button, CircularProgress, Divider } from "@mui/material";

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/profile");
        setProfile(response.data.data);
      } catch (error) {
        console.error("Error fetching profile", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading)
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <CircularProgress sx={{ color: "#0b4e70" }} />
      </div>
    );

  return (
    // ADDED: transition-all and ml-20/ml-64 to sync with your SidePanel
    // If you have a global Layout component, you can remove these margins.
    <div className="min-h-screen bg-[#f8fafc] pb-12 transition-all duration-300  w-full">
      {/* 1. TOP BANNER */}
      <div className="h-64 w-full bg-gradient-to-r from-[#0b4e70] via-[#0d4461] to-[#1e293b] relative">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 animate-slide-up">
        {/* 2. PROFILE OVERLAP CARD */}
        <div className="relative -mt-32 bg-white rounded-3xl shadow-xl shadow-blue-900/5 border border-gray-100 overflow-hidden">
          {/* Header Row */}
          <div className="p-8 flex flex-col md:flex-row items-center md:items-end gap-6">
            <div className="relative flex-shrink-0">
              <Avatar
                sx={{
                  width: { xs: 120, md: 150 },
                  height: { xs: 120, md: 150 },
                  bgcolor: "#0b4e70",
                  fontSize: "4rem",
                  border: "6px solid white",
                }}
                className="shadow-2xl"
              >
                {profile?.userName?.substring(0, 2).toUpperCase()}
              </Avatar>
              <div className="absolute bottom-2 right-2 bg-green-500 p-1.5 rounded-full border-4 border-white shadow-lg">
                <VerifiedUser className="text-white !text-sm" />
              </div>
            </div>

            <div className="flex-1 text-center md:text-left pb-2">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-black text-[#0d4461] tracking-tight">
                    {profile?.userName}
                  </h1>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-2">
                    <span className="bg-orange-100 text-[#f59e0b] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                      <Security className="!text-xs" /> {profile?.role}
                    </span>
                    <span className="text-gray-400 text-sm flex items-center gap-1">
                      <CalendarToday className="!text-xs" /> Joined{" "}
                      {new Date(profile?.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <Button
                  variant="contained"
                  startIcon={<Edit />}
                  sx={{
                    bgcolor: "#0b4e70",
                    "&:hover": { bgcolor: "#0d4461" },
                    borderRadius: "12px",
                    px: 4,
                    py: 1.2,
                    textTransform: "none",
                    fontWeight: "bold",
                    flexShrink: 0,
                  }}
                  onClick={() => navigate(`/profile/edit`)} // Updat
                >
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>

          <Divider className="mx-8 mt-4 md:mt-8" />

          {/* Content Body */}
          <div className="grid grid-cols-1 lg:grid-cols-3">
            {/* Left Column: Details */}
            <div className="lg:col-span-2 p-8 space-y-8 border-b lg:border-b-0 lg:border-r border-gray-100">
              <section>
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6">
                  Account Credentials
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="flex items-start gap-4 group">
                    <div className="p-3 bg-blue-50 text-[#0b4e70] rounded-2xl transition-all group-hover:scale-110">
                      <Email />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-400 mb-0.5">
                        Email Address
                      </p>
                      <p className="text-[#0d4461] font-semibold truncate">
                        {profile?.userEmail}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 group">
                    <div className="p-3 bg-orange-50 text-[#f59e0b] rounded-2xl transition-all group-hover:scale-110">
                      <Badge />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-400 mb-0.5">
                        Identification
                      </p>
                      <p className="text-[#0d4461] font-semibold">
                        User ID: #{profile?.userId}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="bg-gray-50/80 p-6 rounded-2xl border border-dashed border-gray-200">
                <div className="flex items-center gap-4 text-[#0d4461]">
                  <WorkspacePremium className="text-[#f59e0b] flex-shrink-0" />
                  <p className="text-sm font-medium">
                    You have been an active member for
                    <span className="font-bold text-[#0b4e70]">
                      {" "}
                      {Math.floor(
                        (new Date() - new Date(profile?.createdAt)) /
                          (1000 * 60 * 60 * 24)
                      )}{" "}
                      days
                    </span>
                    .
                  </p>
                </div>
              </section>
            </div>

            {/* Right Column: Status & Activity */}
            <div className="bg-[#fcfdfe] p-8 flex flex-col items-center justify-center text-center space-y-6">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-white flex items-center justify-center transition-transform group-hover:rotate-12">
                  <Person sx={{ fontSize: 50 }} className="text-gray-200" />
                </div>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-white px-3 py-0.5 rounded-full shadow-sm border border-gray-100">
                  <span className="text-[10px] font-black text-green-600 uppercase">
                    Online
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-[#0d4461] font-bold">Profile Integrity</h4>
                <p className="text-[11px] text-gray-500 mt-2 leading-relaxed px-4">
                  Your account is fully verified and compliant with all
                  volunteering standards.
                </p>
              </div>

              <div className="w-full max-w-[180px] space-y-2">
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#0b4e70] w-full animate-pulse shadow-[0_0_8px_rgba(11,78,112,0.4)]"></div>
                </div>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">
                  Verified Status
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. HELP FOOTER */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-400">
            Need help with your account?{" "}
            <button className="text-[#0b4e70] font-bold hover:underline">
              Contact Support
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
