import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

type ConsumidorItem = {
  fecha: string;         // "YYYYMMDD"
  tipo: string;          // "CF"
  impuesto: string;      // "248.7500 "
  precsinimp: string;    // "271.6700 "
  fechaupd: string;      // "YYYY/MM/DD"
  id: string;            // producto id
  preciototal: string;   // "577.0000 "
  nomprod: string;       // "GASOLINA SUPER ( SUPERIOR )"
  margenpromedio: string;
};

const Report2 = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErrorMsg(null);
      try {
        const res = await fetch("https://api.recope.go.cr/ventas/precio/consumidor");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json: ConsumidorItem[] = await res.json();

        // Labels y valores
        const labels = json.map(i => i.nomprod.trim());
        const values = json.map(i => parseFloat(i.preciototal.trim()));

        setData({
          labels,
          datasets: [
            {
              label: "Precio total al consumidor (CRC)",
              data: values,
              // Puedes dejar que Chart.js asigne colores automáticamente o definir algunos:
              backgroundColor: [
                "#4BC0C0", "#36A2EB", "#FF6384", "#FFCE56",
                "#9966FF", "#FF9F40", "#22C55E", "#F43F5E",
              ],
            },
          ],
        });
      } catch (err: any) {
        setErrorMsg(`Error al cargar datos: ${err.message ?? err}`);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-3xl shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold">
            Reporte 2: Precio al Consumidor (RECOPE)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="bg-muted rounded-lg p-4 mb-8 text-center min-h-[320px]">
            {loading && <p className="text-muted-foreground">Cargando datos…</p>}
            {!loading && errorMsg && (
              <p className="text-destructive">{errorMsg}</p>
            )}
            {!loading && !errorMsg && data && <Pie data={data} />}
          </div>

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

export default Report2;
