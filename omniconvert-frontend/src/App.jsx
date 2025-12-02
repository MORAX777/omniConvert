import React, { useState } from "react";
import { 
    Layers, Music, Video, Image as ImageIcon, FileText, 
    Settings, Code, ArrowRight, UploadCloud, Download, CheckCircle, Cpu, Shield, Terminal
} from "lucide-react";
import ThreeScene from "./components/ThreeScene";

const ToolUI = ({ title, icon: Icon, color, endpoint, formats }) => {
    const [file, setFile] = useState(null);
    const [settings, setSettings] = useState({ format: formats[0] });
    const [processing, setProcessing] = useState(false);
    const [result, setResult] = useState(null);

    const processFile = async () => {
        setProcessing(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("format", settings.format);
        if(title === "Image Resizer") {
             formData.append("width", 800);
             formData.append("height", 600);
        }

        try {
            const response = await fetch(`https://omniconvert-qzw1.onrender.com/api/v1${endpoint}`, {
                method: "POST",
                body: formData
            });
            const data = await response.json();
            if (data.success) {
                if(data.message.includes("Simulated")) {
                    alert("Success! Backend received file. (FFmpeg simulation mode active)");
                    setResult("#");
                } else {
                    setResult(data.downloadUrl);
                }
            } else {
                alert("Error: " + data.error);
            }
        } catch (error) {
            console.error(error);
            alert("Backend error. Check console.");
        }
        setProcessing(false);
    };

    return (
        <div className="max-w-5xl mx-auto p-4 relative z-10 animate-fade-in">
            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700 p-8 rounded-2xl shadow-2xl">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-white flex items-center gap-3"><Icon className={color} /> {title}</h2>
                    <div className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-xs font-bold flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> ONLINE</div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <label className="block w-full border-2 border-dashed border-slate-600 rounded-xl p-10 text-center cursor-pointer hover:border-blue-500 hover:bg-slate-800/50 transition-all">
                            <input type="file" className="hidden" onChange={e => setFile(e.target.files[0])} />
                            <UploadCloud className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                            <span className="text-slate-200 font-medium">{file ? file.name : "Click to Upload"}</span>
                        </label>
                        <div className="grid grid-cols-1 gap-4">
                            <label className="text-sm text-slate-400">Target Format</label>
                            <select value={settings.format} onChange={e => setSettings({...settings, format: e.target.value})} className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white">
                                {formats.map(f => <option key={f} value={f}>{f.toUpperCase()}</option>)}
                            </select>
                        </div>
                        <button onClick={processFile} disabled={!file || processing} className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-all">{processing ? "Processing..." : "Convert Now"}</button>
                    </div>
                    <div className="bg-black/40 rounded-xl border border-slate-700 p-4 flex items-center justify-center min-h-[300px]">
                        {result ? (
                            <div className="text-center space-y-4">
                                <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                                <h3 className="text-xl font-bold text-white">Complete!</h3>
                                <button className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold"><Download className="w-4 h-4" /> Download</button>
                            </div>
                        ) : <div className="text-slate-500">Output Preview</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

const LandingPage = ({ setTab }) => (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
        <div className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-sm font-medium backdrop-blur-sm"><span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span> Enterprise Engine v2.0</div>
        <h1 className="text-6xl md:text-7xl font-black text-white tracking-tight mb-6 drop-shadow-2xl">CONVERT <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">ANYTHING</span></h1>
        <p className="text-xl text-slate-300 max-w-2xl mb-10 leading-relaxed font-light">The ultimate developer-first media API. Scalable microservices for Audio, Video, and Image processing.</p>
        <div className="flex gap-4"><button onClick={() => setTab("image")} className="px-8 py-4 bg-white text-slate-900 font-bold rounded-full hover:bg-slate-200 transition-all flex items-center gap-2 shadow-lg shadow-white/10">Launch App <ArrowRight className="w-5 h-5" /></button></div>
    </div>
);

const App = () => {
    const [activeTab, setActiveTab] = useState("landing");
    
    const renderContent = () => {
        switch(activeTab) {
            case "image": return <ToolUI title="Image Resizer" icon={ImageIcon} color="text-blue-400" endpoint="/image/resize" formats={["jpeg","png","webp"]} />;
            case "audio": return <ToolUI title="Audio Converter" icon={Music} color="text-pink-400" endpoint="/audio/convert" formats={["mp3","wav","aac"]} />;
            case "video": return <ToolUI title="Video Converter" icon={Video} color="text-indigo-400" endpoint="/video/convert" formats={["mp4","mov","gif"]} />;
            case "doc": return <ToolUI title="Doc Converter" icon={FileText} color="text-orange-400" endpoint="/document/convert" formats={["pdf","docx","txt"]} />;
            default: return <LandingPage setTab={setActiveTab} />;
        }
    };

    return (
        <div className="min-h-screen text-slate-200 font-sans selection:bg-cyan-500/30 flex flex-col">
            <ThreeScene />
            <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex justify-between items-center border-b border-white/5 bg-slate-900/20 backdrop-blur-sm">
                <div className="flex items-center gap-2 font-bold text-xl tracking-tighter text-white cursor-pointer" onClick={() => setActiveTab("landing")}><Layers className="text-cyan-400" /> OMNICONVERT</div>
                <div className="hidden md:flex gap-6 text-sm font-medium text-slate-300">
                    <button onClick={() => setActiveTab("image")} className={`hover:text-cyan-400 transition-colors ${activeTab === "image" ? "text-cyan-400" : ""}`}>Image</button>
                    <button onClick={() => setActiveTab("audio")} className={`hover:text-cyan-400 transition-colors ${activeTab === "audio" ? "text-cyan-400" : ""}`}>Audio</button>
                    <button onClick={() => setActiveTab("video")} className={`hover:text-cyan-400 transition-colors ${activeTab === "video" ? "text-cyan-400" : ""}`}>Video</button>
                    <button onClick={() => setActiveTab("doc")} className={`hover:text-cyan-400 transition-colors ${activeTab === "doc" ? "text-cyan-400" : ""}`}>Docs</button>
                </div>
                <div className="flex items-center gap-4"><Settings className="w-5 h-5 text-slate-400" /></div>
            </nav>
            <main className="pt-24 px-4 pb-12 flex-1">
                {renderContent()}
            </main>
            
            {/* FOOTER */}
            <footer className="relative z-10 py-6 text-center text-slate-500 text-sm border-t border-white/5 bg-slate-900/40 backdrop-blur-md">
                <p>© 2025 OmniConvert Enterprise. <span className="text-cyan-400 font-bold">Developed by Aryan</span>.</p>
                <p className="text-xs mt-1 opacity-50">Released under MIT License</p>
            </footer>
        </div>
    );
};
export default App;