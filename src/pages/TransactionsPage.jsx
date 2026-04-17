import './TransactionsPage.css'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

function TransactionsPage() {
  const monthlyData = [
    { month: 'Oca', users: 1420, drivers: 830, couriers: 610, trips: 5200 },
    { month: 'Sub', users: 1580, drivers: 860, couriers: 640, trips: 5600 },
    { month: 'Mar', users: 1710, drivers: 910, couriers: 670, trips: 5900 },
    { month: 'Nis', users: 1650, drivers: 940, couriers: 700, trips: 6100 },
    { month: 'May', users: 1810, drivers: 980, couriers: 720, trips: 6400 },
    { month: 'Haz', users: 1920, drivers: 1020, couriers: 760, trips: 6900 },
    { month: 'Tem', users: 2050, drivers: 1060, couriers: 790, trips: 7200 },
    { month: 'Agu', users: 2140, drivers: 1110, couriers: 820, trips: 7400 },
    { month: 'Eyl', users: 2230, drivers: 1160, couriers: 860, trips: 7800 },
    { month: 'Eki', users: 2310, drivers: 1200, couriers: 900, trips: 8100 },
    { month: 'Kas', users: 2390, drivers: 1230, couriers: 930, trips: 8400 },
    { month: 'Ara', users: 2460, drivers: 1270, couriers: 960, trips: 8700 },
  ]

  const miniCharts = [
    {
      title: 'Aktif Kullanici',
      value: monthlyData[monthlyData.length - 1].users.toLocaleString('tr-TR'),
      trend: '+12.4%',
      dataKey: 'users',
      stroke: '#7c3aed',
    },
    {
      title: 'Aktif Surucu',
      value: monthlyData[monthlyData.length - 1].drivers.toLocaleString('tr-TR'),
      trend: '+7.1%',
      dataKey: 'drivers',
      stroke: '#2563eb',
    },
    {
      title: 'Aktif Kurye',
      value: monthlyData[monthlyData.length - 1].couriers.toLocaleString('tr-TR'),
      trend: '+4.6%',
      dataKey: 'couriers',
      stroke: '#0891b2',
    },
  ]

  return (
    <section className="transactions-page">
      <article className="map-card map-card--hero">
        <header className="card-header">
          <h2>Canli Harita Takibi</h2>
          <span className="status-chip">Online</span>
        </header>
        <div className="map-frame">
          <iframe
            title="Google map"
            src="https://www.google.com/maps?q=Istanbul&z=11&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </article>

      <div className="mini-chart-grid">
        {miniCharts.map((chart) => (
          <article key={chart.title} className="mini-chart-card">
            <header className="card-header">
              <h2>{chart.title}</h2>
              <span className="trend-up">{chart.trend}</span>
            </header>
            <div className="metric-value">{chart.value}</div>
            <div className="mini-chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e6ecf5" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#7a8aa0' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#7a8aa0' }} width={34} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey={chart.dataKey}
                    stroke={chart.stroke}
                    strokeWidth={3}
                    dot={{ r: 2 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </article>
        ))}
      </div>

      <article className="trips-card">
        <header className="card-header">
          <h2>Tamamlanmis Yolculuklar</h2>
          <span className="period-pill">Year</span>
        </header>
        <div className="trips-chart-wrapper">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e6ecf5" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6d7d94' }} />
              <YAxis tick={{ fontSize: 12, fill: '#6d7d94' }} width={36} />
              <Tooltip />
              <Bar dataKey="trips" fill="#2563eb" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </article>
    </section>
  )
}

export default TransactionsPage
