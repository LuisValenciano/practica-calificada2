import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // For demo purposes, any username/password works
    if (username.trim() && password.trim()) {
      localStorage.setItem("isAuthenticated", "true");
      navigate("/dashboard");
    }
  };

  // Quick bypass for testing - remove in production
  const handleQuickLogin = () => {
    localStorage.setItem("isAuthenticated", "true");
    navigate("/dashboard");
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
              <Label htmlFor="username" className="text-sm font-medium">
                Usuario
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-11"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11"
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-11 font-medium"
              disabled={!username.trim() || !password.trim()}
            >
              Ingresar
            </Button>
            
            <Button 
              type="button"
              onClick={handleQuickLogin}
              variant="secondary" 
              className="w-full h-11 font-medium"
            >
              Test Login (Demo)
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;