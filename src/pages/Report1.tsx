import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input"; // Asegurate de tener este componente

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Report1 = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [loading, setLoading] = useState(false);

const formatearFecha = (fecha: string) => {
  return fecha.replace(/-/g, "");
};

  const obtenerDatos = () => {
    if (!fechaInicio || !fechaFin) return;

    const inicio = formatearFecha(fechaInicio);
    const fin = formatearFecha(fechaFin);

    setLoading(true);
    fetch(`https://api.recope.go.cr/precio-internacional?inicio=${inicio}&fin=${fin}`)
      .then((res) => res.json())
      .then((json) => {
        const productos = json.materiales;

        const labels = productos.map((prod: any) => prod.nomprod);
        const values = productos.map((prod: any) => {
          const suma = prod.precios.reduce((a: number, b: number) => a + b, 0);
          return Math.round((suma / prod.precios.length) * 100) / 100;
        });

        setData({
          labels,
          datasets: [
            {
              label: "Precio promedio internacional (USD)",
              data: values,
              backgroundColor: "rgba(75, 192, 192, 0.6)",
            },
          ],
        });
      })
      .catch((error) => console.error("Error al cargar datos de RECOPE:", error))
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-4xl shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold">Reporte 1: Precio Internacional</CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          {/* Formulario de fechas */}
          <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-center">
            <div className="flex flex-col items-start">
              <label className="text-sm font-medium">Fecha de inicio</label>
              <Input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
            </div>
            <div className="flex flex-col items-start">
              <label className="text-sm font-medium">Fecha de fin</label>
              <Input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
            </div>
            <Button onClick={obtenerDatos} className="mt-5 md:mt-0">Buscar</Button>
          </div>

          {/* Gráfico */}
          <div className="bg-muted rounded-lg p-4 mb-8 text-center min-h-[300px]">
            {loading ? (
              <p className="text-muted-foreground">Cargando datos...</p>
            ) : data ? (
              <Bar data={data} />
            ) : (
              <p className="text-muted-foreground">Seleccione un rango de fechas para ver el gráfico.</p>
            )}
          </div>

          {/* Botón de volver */}
          <div className="text-center">
            <Button onClick={() => navigate("/dashboard")} variant="secondary" className="px-8">
              Volver
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Report1;
