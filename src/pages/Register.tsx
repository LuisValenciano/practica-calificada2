import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

const API = import.meta.env.VITE_API_URL;

export default function Register() {
    const [username, setU] = useState("");
    const [password, setP] = useState("");
    const [loading, setL] = useState(false);
    const nav = useNavigate();

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setL(true);
        try {
            // 1) Registrar
            const r = await fetch(`${API}/api/Auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });
            if (!r.ok) throw new Error("No se pudo registrar");
            // 2) Loguear automáticamente
            const login = await fetch(`${API}/api/Auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });
            if (!login.ok) throw new Error("Error al iniciar sesión");
            const data = await login.json();
            localStorage.setItem("authToken", data.token);
            if (data.expiresAt) localStorage.setItem("tokenExpiry", data.expiresAt);
            nav("/dashboard");
        } catch (e: any) {
            alert(e.message || "Error");
        } finally {
            setL(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardContent className="p-8">
                    <form onSubmit={submit} className="space-y-6">
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-semibold">Crear cuenta</h1>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="user">Usuario (email)</Label>
                            <Input id="user" value={username} onChange={(e) => setU(e.target.value)} className="h-11" required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="pass">Contraseña</Label>
                            <Input id="pass" type="password" value={password} onChange={(e) => setP(e.target.value)} className="h-11" required />
                        </div>

                        <Button type="submit" className="w-full h-11 font-medium" disabled={!username.trim() || !password.trim() || loading}>
                            {loading ? "Creando..." : "Registrarme"}
                        </Button>

                        <Button type="button" variant="secondary" className="w-full h-11 font-medium" onClick={() => nav("/login")}>
                            Volver a iniciar sesión
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
