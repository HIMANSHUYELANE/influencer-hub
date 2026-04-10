import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import { useAuth } from "../context/AuthContext";
import {
  ChevronLeft,
  DollarSign,
  Calendar,
  MapPin,
  CheckCircle,
  Send,
  AlertCircle,
  Building,
  XCircle,
  User,
} from "lucide-react";

const CampaignDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [applications, setApplications] = useState([]);
  const [applyMessage, setApplyMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/campaigns/${id}`);
        setCampaign(res.data);

        // If brand, fetch applications for this campaign
        if (user?.role === "brand") {
          const appsRes = await axios.get(`/applications/brand/${id}`);
          setApplications(appsRes.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, user]);

  const handleApply = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/applications", {
        campaignId: id,
        message: applyMessage,
      });
      setStatus({ type: "success", text: "Application sent successfully!" });
      setApplyMessage("");
    } catch (err) {
      setStatus({
        type: "error",
        text: err.response?.data?.message || "Failed to apply.",
      });
    }
  };

  const updateAppStatus = async (appId, newStatus) => {
    try {
      await axios.put(`/applications/${appId}/status`, { status: newStatus });
      // Refresh applications list
      const appsRes = await axios.get(`/applications/brand/${id}`);
      setApplications(appsRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="p-12 text-center text-slate-500 font-medium tracking-tight">
        Loading Details...
      </div>
    );
  if (!campaign)
    return (
      <div className="p-12 text-center text-slate-500 font-medium">
        Campaign not found.
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto px-8 py-12">
      <Link
        to="/campaigns"
        className="flex items-center gap-2 text-slate-500 hover:text-primary-600 font-bold mb-8 transition-colors"
      >
        <ChevronLeft size={20} /> Back to Search
      </Link>

      <div className="flex flex-col gap-12">
        {/* Header Block */}
        <section className="card p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 bg-white border-none shadow-2xl">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-primary-100 rounded-[30px] flex items-center justify-center font-extrabold text-primary-600 text-3xl">
              {campaign.brandId?.businessName?.[0] || "C"}
            </div>
            <div>
              <h1 className="text-4xl font-extrabold mb-2 tracking-tight">
                {campaign.title}
              </h1>
              <div className="flex items-center gap-4 text-slate-500 font-medium">
                <span className="flex items-center gap-1">
                  <Building size={16} />
                  {campaign.brandId?.businessName}
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign size={16} className="text-green-500" />
                  {campaign.budget}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <span className="px-4 py-2 bg-green-50 text-green-600 rounded-2xl font-bold text-sm tracking-widest uppercase">
              {campaign.status}
            </span>
          </div>
        </section>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Info */}
          <div className="lg:w-2/3 flex flex-col gap-12">
            <section>
              <h2 className="text-2xl font-extrabold mb-6 flex items-center gap-3">
                <div className="w-1.5 h-8 bg-primary-500 rounded-full"></div>
                Campaign Description
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed whitespace-pre-wrap">
                {campaign.description}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-extrabold mb-6 flex items-center gap-3">
                <div className="w-1.5 h-8 bg-indigo-500 rounded-full"></div>
                Requirements
              </h2>
              <div className="flex flex-col gap-4">
                {campaign.requirements?.map((req, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl group transition-all hover:bg-white hover:shadow-xl hover:shadow-primary-100"
                  >
                    <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center font-bold">
                      {idx + 1}
                    </div>
                    <span className="text-slate-700 font-bold">{req}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Panel: Interaction */}
          <div className="lg:w-1/3">
            {!user && (
              <div className="card border-none shadow-2xl overflow-hidden bg-white">
                <div className="bg-slate-800 p-8 text-white text-center">
                  <h3 className="text-xl font-bold">Interested in this?</h3>
                  <p className="text-slate-400 text-sm mt-2">
                    Sign in to start collaborating with brands like this one.
                  </p>
                </div>
                <div className="p-8 flex flex-col gap-4">
                  <Link
                    to="/login"
                    className="btn-primary w-full py-4 text-center"
                  >
                    Login to Apply
                  </Link>
                  <p className="text-center text-sm text-slate-500 font-medium">
                    New here?{" "}
                    <Link
                      to="/register"
                      className="text-primary-600 hover:underline"
                    >
                      Create an account
                    </Link>
                  </p>
                </div>
              </div>
            )}

            {user?.role === "creator" && (
              <div className="card sticky top-32 border-none shadow-2xl overflow-hidden">
                <div className="bg-primary-600 p-6 text-white text-center">
                  <h3 className="text-xl font-bold">Apply Now</h3>
                  <p className="text-primary-100 text-sm mt-1">
                    Ready to collaborate?
                  </p>
                </div>
                <div className="p-6">
                  <form onSubmit={handleApply} className="flex flex-col gap-4">
                    <textarea
                      placeholder="Type your pitch here... (Engagement rates, experience, why you're a fit)"
                      value={applyMessage}
                      onChange={(e) => setApplyMessage(e.target.value)}
                      className="w-full h-40 p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 font-medium"
                      required
                    />
                    <button
                      type="submit"
                      className="btn-primary w-full py-4 flex items-center justify-center gap-2 group"
                    >
                      <Send
                        size={18}
                        className="transition-transform group-hover:translate-x-1"
                      />
                      Submit Application
                    </button>
                    {status.text && (
                      <div
                        className={`mt-2 p-4 rounded-2xl flex items-start gap-4 text-sm font-bold ${status.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
                      >
                        {status.type === "success" ? (
                          <CheckCircle className="shrink-0" />
                        ) : (
                          <AlertCircle className="shrink-0" />
                        )}
                        <span>{status.text}</span>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            )}

            {user?.role === "brand" && (
              <div className="flex flex-col gap-8">
                <h3 className="text-2xl font-extrabold flex items-center gap-3">
                  Applications{" "}
                  <span className="bg-primary-100 text-primary-600 px-3 py-0.5 rounded-full text-sm">
                    {applications.length}
                  </span>
                </h3>
                <div className="flex flex-col gap-4">
                  {applications.length > 0 ? (
                    applications.map((app) => (
                      <div key={app._id} className="card shadow-md p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold">
                              👤
                            </div>
                            <h4 className="font-bold">
                              {app.creatorId?.name || "Creator"}
                            </h4>
                          </div>
                          <span className="text-[10px] uppercase font-extrabold text-slate-400 p-1 bg-slate-50 rounded tracking-widest">
                            {app.status}
                          </span>
                        </div>
                        <p className="text-slate-500 text-sm mb-6 leading-relaxed italic border-l-2 border-primary-200 pl-4">
                          "{app.message}"
                        </p>

                        <Link
                          to={`/creators/${app.creatorId?._id}`}
                          className="w-full mb-3 flex items-center justify-center gap-2 bg-slate-50 text-slate-700 py-2.5 rounded-xl text-sm font-bold border border-slate-100 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-100 transition-all"
                        >
                          <User size={16} /> View Profile
                        </Link>

                        {app.status === "pending" && (
                          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-50">
                            <button
                              onClick={() =>
                                updateAppStatus(app._id, "accepted")
                              }
                              className="flex items-center justify-center gap-2 bg-green-500 text-white py-2 rounded-xl text-sm font-bold shadow-lg shadow-green-100 hover:bg-green-600 transition-colors"
                            >
                              <CheckCircle size={16} /> Accept
                            </button>
                            <button
                              onClick={() =>
                                updateAppStatus(app._id, "rejected")
                              }
                              className="flex items-center justify-center gap-2 bg-slate-100 text-slate-500 py-2 rounded-xl text-sm font-bold hover:bg-red-50 hover:text-red-500 transition-colors"
                            >
                              <XCircle size={16} /> Reject
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="card text-center p-12 bg-slate-50 border-dashed justify-center border-2 border-slate-200">
                      <p className="text-slate-400 font-medium">
                        No applications yet.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetail;
