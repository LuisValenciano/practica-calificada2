import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type Periodo = { desde: string; hasta: string };
type Material = { id: string; nomprod: string; precios: number[] };
type ApiResp = { periodos: Periodo[]; materiales: Material[] };

const Report3 = () => {
  const navigate = useNavigate();
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [productos, setProductos] = useState<Material[]>([]);
  const [periodos, setPeriodos] = useState<Periodo[]>([]);
  const [productoId, setProductoId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const formatearFechaParam = (fecha: string) => fecha.replace(/-/g, "");
  const formatearLabelPeriodo = (p: Periodo) =>
    `${p.desde.slice(0, 4)}-${p.desde.slice(4, 6)}-${p.desde.slice(6, 8)} → ${p.hasta.slice(0, 4)}-${p.hasta.slice(4, 6)}-${p.hasta.slice(6, 8)}`;

  const cargarDatos = async () => {
    if (!fechaInicio || !fechaFin) return;
    const inicio = formatearFechaParam(fechaInicio);
    const fin = formatearFechaParam(fechaFin);

    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`https://api.recope.go.cr/precio-internacional?inicio=${inicio}&fin=${fin}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: ApiResp = await res.json();

      setProductos(json.materiales ?? []);
      setPeriodos(json.periodos ?? []);
      // Seleccionar por defecto el primer producto si no hay uno elegido aún
      if (!productoId && (json.materiales?.length ?? 0) > 0) {
        setProductoId(json.materiales[0].id);
      }
    } catch (err: any) {
      setErrorMsg(`Error al cargar datos: ${err?.message ?? String(err)}`);
      setProductos([]);
      setPeriodos([]);
    } finally {
      setLoading(false);
    }
  };

  const datasetSeleccionado = useMemo(() => {
    if (!productoId) return null;
    const prod = productos.find((p) => p.id === productoId);
    if (!prod) return null;

    // Asegurar numeric
    const data = (prod.precios ?? []).map((v) => Number(v));
    const labels = (periodos ?? []).map(formatearLabelPeriodo);

    return {
      labels,
      datasets: [
        {
          label: `${prod.nomprod} — Precio internacional (USD)`,
          data,
          fill: false,
          borderWidth: 2,
          pointRadius: 3,
        },
      ],
    };
  }, [productoId, productos, periodos]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-5xl shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold">
            Reporte 3: Evolución histórica de precios internacionales del barril (líneas)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          {/* Filtros */}
          <div className="flex flex-col md:flex-row items-center gap-4 justify-center">
            <div className="flex flex-col items-start">
              <label className="text-sm font-medium">Fecha de inicio</label>
              <Input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
            </div>
            <div className="flex flex-col items-start">
              <label className="text-sm font-medium">Fecha de fin</label>
              <Input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
            </div>
            <Button onClick={cargarDatos} className="mt-2 md:mt-6">Buscar</Button>
          </div>

          {/* Selector de producto (nativo para evitar dependencias) */}
          <div className="flex flex-col md:flex-row items-center gap-4 justify-center">
            <div className="flex flex-col items-start w-full md:w-1/2">
              <label className="text-sm font-medium">Producto</label>
              <select
                className="w-full border rounded-md px-3 py-2 bg-background"
                value={productoId}
                onChange={(e) => setProductoId(e.target.value)}
                disabled={productos.length === 0}
              >
                {productos.length === 0 && <option value="">Seleccione un rango y busque…</option>}
                {productos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nomprod}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Gráfico */}
          <div className="bg-muted rounded-lg p-4 text-center min-h-[320px]">
            {loading && <p className="text-muted-foreground">Cargando datos…</p>}
            {!loading && errorMsg && <p className="text-destructive">{errorMsg}</p>}
            {!loading && !errorMsg && datasetSeleccionado ? (
              <Line data={datasetSeleccionado} />
            ) : (
              !loading &&
              !errorMsg && (
                <p className="text-muted-foreground">
                  Seleccione un rango de fechas y un producto para ver el gráfico.
                </p>
              )
            )}
          </div>

          {/* Volver */}
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

export default Report3;
