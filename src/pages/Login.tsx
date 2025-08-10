import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

const API = import.meta.env.VITE_API_URL; // ej: http://localhost:5287

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/Auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) throw new Error("Credenciales inválidas");
      const data = await res.json();
      localStorage.setItem("authToken", data.token);
      if (data.expiresAt) localStorage.setItem("tokenExpiry", data.expiresAt);
      navigate("/dashboard");
    } catch (err: any) {
      alert(err.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-semibold text-foreground">Iniciar Sesión</h1>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Usuario</Label>
              <Input id="username" value={username} onChange={(e)=>setUsername(e.target.value)} className="h-11" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="h-11" required />
            </div>

            <Button type="submit" className="w-full h-11 font-medium" disabled={!username.trim() || !password.trim() || loading}>
              {loading ? "Ingresando..." : "Ingresar"}
            </Button>

            <Button
              type="button"
              variant="secondary"
              className="w-full h-11 font-medium"
              onClick={() => navigate("/register")}
            >
              Crear cuenta
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
