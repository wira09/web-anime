import React, { useState } from "react";
import { CheckIcon, ClipboardDocumentIcon } from "@heroicons/react/24/outline";

const donationMethods = [
  {
    name: "DANA",
    logo: "/assets/donasi/dana.png",
    account: "083841407959",
    holder: "Mohamad Zaelani Wira Kusuma",
    color: "bg-blue-400",
  },
  {
    name: "GoPay",
    logo: "/assets/donasi/gopay.png",
    account: "083841407959",
    holder: "Mohamad Zaelani Wira Kusuma",
    color: "bg-green-400",
  },
  {
    name: "SeaBank",
    logo: "/assets/donasi/seabank.svg",
    account: "901121822291",
    holder: "Mohamad Zaelani Wira Kusuma",
    color: "bg-orange-400",
  },
  {
    name: "Bank Jago",
    logo: "/assets/donasi/jago.svg",
    account: "106123026061",
    holder: "Mohamad Zaelani Wira Kusuma",
    color: "bg-yellow-400",
  },
];

const Dukungan = () => {
  const [copiedId, setCopiedId] = useState(null);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="relative min-h-screen pt-16 pb-24 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_50%,rgba(99,102,241,0.1)_0%,rgba(0,0,0,0)_100%)]" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 px-4">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl mb-6">
            Dukung <span className="text-gradient">Wira Anime</span>
          </h1>
          <p className="text-lg text-gray-400 leading-relaxed">
            Bantu kami terus memberikan konten anime terbaik dengan memberikan
            dukungan melalui metode pembayaran di bawah ini. Setiap dukungan
            Anda sangat berarti bagi kami.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto px-4">
          {donationMethods.map((method, index) => (
            <div
              key={index}
              className="group relative glass rounded-[2rem] p-8 hover:bg-white/[0.08] transition-all duration-500 transform hover:-translate-y-2"
            >
              <div className="flex items-center justify-between mb-10">
                <div className="bg-white p-4 rounded-2xl group-hover:bg-slate-200 transition-colors border border-white/5 group-hover:border-white/10">
                  <img
                    src={method.logo}
                    className="h-8 w-auto object-contain brightness-110"
                    alt={method.name}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">
                    {method.name}
                  </span>
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${method.color} animate-pulse`}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-bold text-indigo-400/80 mb-2 uppercase tracking-[0.15em]">
                    Nomor Rekening / HP
                  </p>
                  <div className="flex items-center justify-between gap-4 bg-black/20 p-4 rounded-2xl border border-white/5 group-hover:border-white/10 transition-colors">
                    <p className="text-xl sm:text-2xl font-mono font-bold text-white tracking-widest">
                      {method.account}
                    </p>
                    <button
                      onClick={() => copyToClipboard(method.account, index)}
                      className="p-2.5 rounded-xl bg-white/5 hover:bg-indigo-500/20 text-gray-400 hover:text-indigo-400 transition-all active:scale-90 border border-white/5"
                      title="Copy to clipboard"
                    >
                      {copiedId === index ? (
                        <CheckIcon className="w-5 h-5" />
                      ) : (
                        <ClipboardDocumentIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-bold text-indigo-400/80 mb-1 uppercase tracking-[0.15em]">
                    Atas Nama
                  </p>
                  <p className="text-lg font-semibold text-gray-100">
                    {method.holder}
                  </p>
                </div>
              </div>

              {/* Hover effect light */}
              <div className="absolute inset-0 -z-10 rounded-[2rem] bg-gradient-to-br from-indigo-500/0 via-transparent to-indigo-500/0 group-hover:from-indigo-500/5 group-hover:to-purple-500/5 transition-all duration-500" />
            </div>
          ))}
        </div>

        <div className="mt-24 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-white/5 bg-white/5 text-gray-400 text-sm">
            <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            Terima kasih atas dukungan Anda yang luar biasa! ❤️
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dukungan;
