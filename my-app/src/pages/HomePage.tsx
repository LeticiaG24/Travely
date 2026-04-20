import { useState, createContext, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface ItemItinerario { id: number; dia: string; nome: string; hora: string; }
export interface Reserva        { id: number; nome: string; horario: string; }
export interface Despesa        { id: number; nome: string; valor: string; tipo: string; }
export interface Trip {
  id: number;
  nome: string;
  inicio: string;
  fim: string;
  destinos: string[];
  status: "planejada" | "concluida";
  itinerario: ItemItinerario[];
  reservas: Reserva[];
  orcamento: { total: string; despesas: Despesa[] };
}

// ─── Global state via Context (simples, sem lib externa) ──────────────────────
interface TripsCtx { trips: Trip[]; addTrip: (t: Trip) => void; updateTrip: (t: Trip) => void; }
const TripsContext = createContext<TripsCtx>(null!);
export function useTrips() { return useContext(TripsContext); }

const INITIAL_TRIPS: Trip[] = [
  {
    id: 1,
    nome: "Europa 2026",
    inicio: "12/06/2026",
    fim: "20/06/2026",
    destinos: ["França", "Itália", "Suíça"],
    status: "planejada",
    itinerario: [
      { id: 1, dia: "12 de junho, sex", nome: "Chegada em Paris", hora: "14:00" },
      { id: 2, dia: "13 de junho, sáb", nome: "Torre Eiffel", hora: "10:00" },
    ],
    reservas: [{ id: 1, nome: "Hotel Lumière Paris", horario: "Check-in 15:00" }],
    orcamento: {
      total: "R$ 12.000,00",
      despesas: [
        { id: 1, nome: "Passagem aérea", valor: "R$ 4.500,00", tipo: "Transporte" },
        { id: 2, nome: "Hotel 4 noites", valor: "R$ 3.200,00", tipo: "Hospedagem" },
      ],
    },
  },
  {
    id: 2,
    nome: "Rio de Janeiro",
    inicio: "10/01/2026",
    fim: "15/01/2026",
    destinos: ["Rio de Janeiro"],
    status: "concluida",
    itinerario: [],
    reservas: [],
    orcamento: { total: "R$ 2.800,00", despesas: [] },
  },
];

export function TripsProvider({ children }: { children: React.ReactNode }) {
  const [trips, setTrips] = useState<Trip[]>(INITIAL_TRIPS);
  const addTrip    = (t: Trip) => setTrips((p) => [...p, t]);
  const updateTrip = (updated: Trip) => setTrips((p) => p.map((t) => (t.id === updated.id ? updated : t)));
  return <TripsContext.Provider value={{ trips, addTrip, updateTrip }}>{children}</TripsContext.Provider>;
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const style = `
  @import url('https://fonts.googleapis.com/css2?family=Libre+Caslon+Text:ital,wght@0,400;0,700;1,400&display=swap');

  :root {
    --bg: #D3D5C8; --card: #C1C3B3; --green: #8BA17A; --green-dark: #6e8460;
    --text: #2a2a2a; --white: #fff; --radius: 20px;
    --font: "Libre Caslon Text", serif;
    --fs: clamp(1rem, 2.5vw, 1.1rem);
  }
  * { margin: 0; box-sizing: border-box; }
  body { background: var(--bg); font-family: var(--font); font-size: var(--fs); color: var(--text); min-height: 100vh; }
  button { cursor: pointer; font-family: var(--font); font-size: var(--fs); }
  h1, h2, h3 { font-weight: normal; }
  hr { border: none; border-top: 1px solid #b0b3a3; }

  .t-header { display: flex; align-items: center; gap: 15px; padding: 15px 20px; }
  .t-header i { font-size: 25px; }

  .t-intro { padding: 20px; display: flex; justify-content: space-between; align-items: center; gap: 16px; }
  .t-intro-text { max-width: 500px; display: flex; flex-direction: column; gap: 10px; }
  .t-btn-primary { background: var(--green); color: var(--white); border: none; padding: 10px 20px; border-radius: var(--radius); height: 40px; width: 30vw; min-width: 160px; transition: background .2s; }
  .t-btn-primary:hover { background: var(--green-dark); }

  .t-viagens { padding: 20px; }
  .t-filter-row { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px; }
  .t-filter-btn { background: var(--green); border: none; color: var(--white); border-radius: var(--radius); padding: 8px 16px; height: 40px; transition: background .2s, opacity .2s; opacity: .7; }
  .t-filter-btn.active { opacity: 1; }
  .t-filter-btn:hover { background: var(--green-dark); opacity: 1; }

  .t-cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 14px; margin-top: 10px; }
  .t-card { background: var(--card); border-radius: var(--radius); padding: 16px 20px; display: flex; flex-direction: column; gap: 6px; cursor: pointer; transition: transform .15s, box-shadow .15s; }
  .t-card:hover { transform: translateY(-3px); box-shadow: 0 6px 18px rgba(0,0,0,.12); }
  .t-card-dates { font-size: .85rem; opacity: .7; }
  .t-card-dest { display: flex; gap: 6px; align-items: center; font-size: .9rem; }
  .t-card-badge { display: inline-block; margin-top: 6px; background: var(--green); color: var(--white); font-size: .75rem; padding: 2px 10px; border-radius: 12px; align-self: flex-start; }
  .t-card-badge.concluida { background: #7a8e6e; }
  .t-empty { opacity: .5; font-style: italic; margin-top: 10px; }

  .t-info { padding: 20px; display: flex; justify-content: space-between; align-items: flex-start; }
  .t-info-left { display: flex; flex-direction: column; gap: 10px; }
  .t-destino { display: flex; gap: 10px; align-items: center; }
  .t-btn-edit { background: transparent; border: none; font-size: var(--fs); display: flex; align-items: center; gap: 6px; color: var(--text); opacity: .7; transition: opacity .2s; }
  .t-btn-edit:hover { opacity: 1; }
  .t-btn-back { background: transparent; border: none; font-size: var(--fs); color: var(--text); opacity: .6; display: flex; align-items: center; gap: 6px; transition: opacity .2s; }
  .t-btn-back:hover { opacity: 1; }

  .t-plano { padding: 0 20px 120px; display: grid; grid-template-columns: minmax(200px, 35vw) auto; gap: 10px; }
  .t-plano-card { background: var(--card); padding: 20px; border-radius: var(--radius); }
  .t-nome-plano { display: flex; gap: 10px; align-items: center; margin-bottom: 12px; }
  #t-itinerario { grid-column: 1 / 3; }
  .t-dias { display: flex; gap: 10px; flex-wrap: wrap; }
  .t-dia { display: flex; flex-direction: column; gap: 8px; }
  .t-item-itinerario { background: var(--green); color: var(--white); padding: 10px 14px; border-radius: var(--radius); }
  .t-reservas-feitas, .t-despesas { display: flex; flex-direction: column; gap: 8px; margin-top: 8px; }
  .t-reserva-item, .t-despesa-item { background: rgba(255,255,255,.35); padding: 8px 12px; border-radius: 12px; display: flex; flex-direction: column; gap: 2px; }
  .t-despesa-tipo { font-size: .8rem; opacity: .65; }

  .t-fab { background: var(--green); color: var(--white); position: fixed; right: 20px; bottom: 20px; font-size: 2rem; border: none; border-radius: 50%; width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,.2); transition: background .2s, transform .2s; z-index: 100; }
  .t-fab:hover { background: var(--green-dark); transform: scale(1.05); }
  .t-criar { display: flex; flex-direction: column; gap: 8px; align-items: flex-end; position: fixed; right: 20px; bottom: 90px; z-index: 100; transition: opacity .2s, transform .2s; }
  .t-criar.hidden { opacity: 0; pointer-events: none; transform: translateY(10px); }
  .t-criar-btn { background: var(--green); color: var(--white); border: none; padding: 10px 14px; border-radius: 15px; display: flex; align-items: center; gap: 8px; box-shadow: 0 2px 8px rgba(0,0,0,.15); transition: background .2s; }
  .t-criar-btn:hover { background: var(--green-dark); }

  .t-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.35); display: flex; align-items: center; justify-content: center; z-index: 200; }
  .t-modal { background: var(--bg); border-radius: var(--radius); padding: 24px; width: min(440px, 92vw); display: flex; flex-direction: column; gap: 14px; }
  .t-modal h2 { font-size: 1.2rem; }
  .t-modal label { display: flex; flex-direction: column; gap: 4px; font-size: .9rem; }
  .t-modal input, .t-modal select { font-family: var(--font); font-size: .95rem; background: var(--card); border: none; border-radius: 10px; padding: 8px 12px; outline: none; color: var(--text); }
  .t-modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 4px; }
  .t-btn-cancel { background: transparent; border: 1px solid #999; border-radius: 12px; padding: 8px 16px; font-family: var(--font); font-size: .9rem; cursor: pointer; }
  .t-btn-save { background: var(--green); color: var(--white); border: none; border-radius: 12px; padding: 8px 16px; font-family: var(--font); font-size: .9rem; cursor: pointer; }
  .t-btn-save:hover { background: var(--green-dark); }

  @media (max-width: 768px) {
    .t-intro { flex-direction: column; }
    .t-btn-primary { width: 100%; margin-top: 8px; }
    .t-plano { grid-template-columns: 1fr; }
    #t-itinerario { grid-column: 1; }
  }
`;

// ─── Modals ───────────────────────────────────────────────────────────────────
function ModalNovaViagem({ onClose, onSave }: { onClose: () => void; onSave: (t: Trip) => void }) {
  const [form, setForm] = useState({ nome: "", inicio: "", fim: "", destinos: "", status: "planejada" });
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));
  const save = () => {
    if (!form.nome.trim()) return;
    onSave({
      id: Date.now(), nome: form.nome, inicio: form.inicio, fim: form.fim,
      destinos: form.destinos.split(",").map((d) => d.trim()).filter(Boolean),
      status: form.status as Trip["status"],
      itinerario: [], reservas: [], orcamento: { total: "R$ 0,00", despesas: [] },
    });
    onClose();
  };
  return (
    <div className="t-overlay" onClick={onClose}>
      <div className="t-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Nova viagem</h2>
        <label>Nome <input value={form.nome} onChange={set("nome")} placeholder="Ex: Europa 2026" /></label>
        <label>Data início <input value={form.inicio} onChange={set("inicio")} placeholder="DD/MM/AAAA" /></label>
        <label>Data fim <input value={form.fim} onChange={set("fim")} placeholder="DD/MM/AAAA" /></label>
        <label>Destinos <input value={form.destinos} onChange={set("destinos")} placeholder="França, Itália..." /></label>
        <label>Status
          <select value={form.status} onChange={set("status")}>
            <option value="planejada">Planejada</option>
            <option value="concluida">Concluída</option>
          </select>
        </label>
        <div className="t-modal-actions">
          <button className="t-btn-cancel" onClick={onClose}>Cancelar</button>
          <button className="t-btn-save" onClick={save}>Salvar</button>
        </div>
      </div>
    </div>
  );
}

function ModalItinerario({ onClose, onSave }: { onClose: () => void; onSave: (i: ItemItinerario) => void }) {
  const [form, setForm] = useState({ dia: "", nome: "", hora: "" });
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const save = () => { if (!form.nome.trim()) return; onSave({ id: Date.now(), ...form }); onClose(); };
  return (
    <div className="t-overlay" onClick={onClose}>
      <div className="t-modal" onClick={(e) => e.stopPropagation()}>
        <h2><i className="fa-solid fa-calendar" style={{ marginRight: 8 }} />Novo item de itinerário</h2>
        <label>Dia <input value={form.dia} onChange={set("dia")} placeholder="Ex: 12 de junho, sex" /></label>
        <label>Nome <input value={form.nome} onChange={set("nome")} placeholder="Ex: Torre Eiffel" /></label>
        <label>Hora <input value={form.hora} onChange={set("hora")} placeholder="Ex: 10:00" /></label>
        <div className="t-modal-actions">
          <button className="t-btn-cancel" onClick={onClose}>Cancelar</button>
          <button className="t-btn-save" onClick={save}>Salvar</button>
        </div>
      </div>
    </div>
  );
}

function ModalReserva({ onClose, onSave }: { onClose: () => void; onSave: (r: Reserva) => void }) {
  const [form, setForm] = useState({ nome: "", horario: "" });
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const save = () => { if (!form.nome.trim()) return; onSave({ id: Date.now(), ...form }); onClose(); };
  return (
    <div className="t-overlay" onClick={onClose}>
      <div className="t-modal" onClick={(e) => e.stopPropagation()}>
        <h2><i className="fa-regular fa-file-lines" style={{ marginRight: 8 }} />Nova reserva</h2>
        <label>Nome <input value={form.nome} onChange={set("nome")} placeholder="Ex: Hotel Lumière" /></label>
        <label>Horário <input value={form.horario} onChange={set("horario")} placeholder="Ex: Check-in 15:00" /></label>
        <div className="t-modal-actions">
          <button className="t-btn-cancel" onClick={onClose}>Cancelar</button>
          <button className="t-btn-save" onClick={save}>Salvar</button>
        </div>
      </div>
    </div>
  );
}

function ModalDespesa({ onClose, onSave }: { onClose: () => void; onSave: (d: Despesa) => void }) {
  const [form, setForm] = useState({ nome: "", valor: "", tipo: "Transporte" });
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const save = () => { if (!form.nome.trim()) return; onSave({ id: Date.now(), ...form }); onClose(); };
  return (
    <div className="t-overlay" onClick={onClose}>
      <div className="t-modal" onClick={(e) => e.stopPropagation()}>
        <h2><i className="fa-solid fa-coins" style={{ marginRight: 8 }} />Nova despesa</h2>
        <label>Nome <input value={form.nome} onChange={set("nome")} placeholder="Ex: Passagem aérea" /></label>
        <label>Valor <input value={form.valor} onChange={set("valor")} placeholder="Ex: R$ 1.500,00" /></label>
        <label>Tipo
          <select value={form.tipo} onChange={set("tipo")}>
            {["Transporte", "Hospedagem", "Alimentação", "Passeio", "Outro"].map((t) => <option key={t}>{t}</option>)}
          </select>
        </label>
        <div className="t-modal-actions">
          <button className="t-btn-cancel" onClick={onClose}>Cancelar</button>
          <button className="t-btn-save" onClick={save}>Salvar</button>
        </div>
      </div>
    </div>
  );
}

// ─── Pages ────────────────────────────────────────────────────────────────────

/** Rota: "/" */
export function HomePage() {
  const { trips, addTrip } = useTrips();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<"todas" | "concluídas" | "planejadas">("todas");
  const [showModal, setShowModal] = useState(false);

  const visible = trips.filter((t) => {
    if (filter === "concluídas") return t.status === "concluida";
    if (filter === "planejadas") return t.status === "planejada";
    return true;
  });

  return (
    <>
      <style>{style}</style>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
      <header className="t-header">
        <i className="fa-regular fa-paper-plane" />
        <h1>Travely</h1>
      </header>
      <hr />
      <section className="t-intro">
        <div className="t-intro-text">
          <h1>Bem vindo, viajante</h1>
          <p>O mundo é grande demais para ficar apenas no papel. Planeje roteiros autênticos e viva histórias inesquecíveis.</p>
        </div>
        <button className="t-btn-primary" onClick={() => setShowModal(true)}>Planejar nova viagem</button>
      </section>
      <hr />
      <section className="t-viagens">
        <div className="t-filter-row">
          {(["todas", "concluídas", "planejadas"] as const).map((f) => (
            <button key={f} className={`t-filter-btn ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        {visible.length === 0 ? (
          <p className="t-empty">Nenhuma viagem encontrada.</p>
        ) : (
          <div className="t-cards-grid">
            {visible.map((trip) => (
              <div key={trip.id} className="t-card" onClick={() => navigate(`/viagem/${trip.id}`)}>
                <h3>{trip.nome}</h3>
                <p className="t-card-dates">{trip.inicio} → {trip.fim}</p>
                <div className="t-card-dest">
                  <i className="fa-solid fa-location-dot" style={{ color: "var(--green)" }} />
                  <span>{trip.destinos.join(", ")}</span>
                </div>
                <span className={`t-card-badge ${trip.status}`}>
                  {trip.status === "concluida" ? "Concluída" : "Planejada"}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
      {showModal && <ModalNovaViagem onClose={() => setShowModal(false)} onSave={addTrip} />}
    </>
  );
}

/** Rota: "/viagem/:id" */
export function ViagemPage() {
  const { id } = useParams<{ id: string }>();
  const { trips, updateTrip } = useTrips();
  const navigate = useNavigate();
  const [fabOpen, setFabOpen] = useState(false);
  const [modal, setModal] = useState<"itinerario" | "reserva" | "despesa" | null>(null);

  const trip = trips.find((t) => t.id === Number(id));
  if (!trip) return <p style={{ padding: 20 }}>Viagem não encontrada. <button onClick={() => navigate("/")}>Voltar</button></p>;

  const openModal = (type: typeof modal) => { setModal(type); setFabOpen(false); };
  const addItinerario = (item: ItemItinerario) => updateTrip({ ...trip, itinerario: [...trip.itinerario, item] });
  const addReserva    = (item: Reserva)        => updateTrip({ ...trip, reservas: [...trip.reservas, item] });
  const addDespesa    = (item: Despesa)        => updateTrip({ ...trip, orcamento: { ...trip.orcamento, despesas: [...trip.orcamento.despesas, item] } });

  const groupedDias = trip.itinerario.reduce<Record<string, ItemItinerario[]>>((acc, item) => {
    const key = item.dia || "Sem data";
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  return (
    <>
      <style>{style}</style>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />

      <section className="t-info">
        <div className="t-info-left">
          <button className="t-btn-back" onClick={() => navigate("/")}>
            <i className="fa-solid fa-arrow-left" /> Voltar
          </button>
          <h1>{trip.nome}</h1>
          <p>{trip.inicio} → {trip.fim}</p>
          <div className="t-destino">
            <i className="fa-solid fa-location-dot" />
            <p>{trip.destinos.join(", ")}</p>
          </div>
        </div>
        <button className="t-btn-edit"><i className="fa-solid fa-pen-to-square" /> Editar</button>
      </section>

      <section className="t-plano">
        <div id="t-itinerario" className="t-plano-card">
          <div className="t-nome-plano"><i className="fa-solid fa-calendar" /><h2>Itinerário</h2></div>
          <div className="t-dias">
            {Object.keys(groupedDias).length === 0 && <p style={{ opacity: .5, fontStyle: "italic" }}>Nenhum item ainda.</p>}
            {Object.entries(groupedDias).map(([dia, items]) => (
              <div key={dia} className="t-dia">
                <h3>{dia}</h3>
                {items.map((item) => (
                  <div key={item.id} className="t-item-itinerario"><p>{item.nome}</p><p>{item.hora}</p></div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div id="t-reservas" className="t-plano-card">
          <div className="t-nome-plano"><i className="fa-regular fa-file-lines" /><h2>Reservas</h2></div>
          <div className="t-reservas-feitas">
            {trip.reservas.length === 0 && <p style={{ opacity: .5, fontStyle: "italic" }}>Nenhuma reserva.</p>}
            {trip.reservas.map((r) => (
              <div key={r.id} className="t-reserva-item"><p>{r.nome}</p><p style={{ opacity: .65, fontSize: ".85rem" }}>{r.horario}</p></div>
            ))}
          </div>
        </div>

        <div id="t-orcamento" className="t-plano-card">
          <div className="t-nome-plano"><i className="fa-solid fa-coins" /><h2>Orçamento</h2></div>
          <p style={{ marginBottom: 8 }}>Total: <strong>{trip.orcamento.total}</strong></p>
          <div className="t-despesas">
            {trip.orcamento.despesas.length === 0 && <p style={{ opacity: .5, fontStyle: "italic" }}>Nenhuma despesa.</p>}
            {trip.orcamento.despesas.map((d) => (
              <div key={d.id} className="t-despesa-item"><p>{d.nome}</p><p>{d.valor}</p><p className="t-despesa-tipo">{d.tipo}</p></div>
            ))}
          </div>
        </div>
      </section>

      <button className="t-fab" onClick={() => setFabOpen((v) => !v)}>
        <i className={`fa-solid ${fabOpen ? "fa-xmark" : "fa-plus"}`} />
      </button>
      <div className={`t-criar ${fabOpen ? "" : "hidden"}`}>
        <button className="t-criar-btn" onClick={() => openModal("itinerario")}><i className="fa-solid fa-calendar" /> Itinerário</button>
        <button className="t-criar-btn" onClick={() => openModal("reserva")}><i className="fa-regular fa-file-lines" /> Reserva</button>
        <button className="t-criar-btn" onClick={() => openModal("despesa")}><i className="fa-solid fa-coins" /> Despesa</button>
      </div>

      {modal === "itinerario" && <ModalItinerario onClose={() => setModal(null)} onSave={addItinerario} />}
      {modal === "reserva"    && <ModalReserva    onClose={() => setModal(null)} onSave={addReserva} />}
      {modal === "despesa"    && <ModalDespesa    onClose={() => setModal(null)} onSave={addDespesa} />}
    </>
  );
}
