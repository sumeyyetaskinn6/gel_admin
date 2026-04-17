import './LoginPage.css'

function LoginPage({ onLogin }) {
  const handleSubmit = (event) => {
    event.preventDefault()
    onLogin()
  }

  return (
    <main className="login-page">
      <div className="background-layer">
        <img src="/backgrounddashboard.png" alt="Gece şehir fonu" />
      </div>

      <section className="left-panel">
        <div className="login-content">
          <img className="gel-logo" src="/logo.png" alt="Gel uygulama logosu" />

          <h1>
            Sistemimize hos geldiniz.
            <br />
            Baslamak icin giris yapin.
          </h1>
          <p className="subtitle">Devam etmek icin lutfen bilgilerinizi girin.</p>

          <form className="login-form" onSubmit={handleSubmit}>
            <label className="field">
              <span className="field-title">Email</span>
              <input type="email" placeholder="Enter your email" required />
            </label>

            <label className="field">
              <span className="field-title">Password</span>
              <input type="password" placeholder="Start typing..." required />
            </label>

            <button type="submit">Giriş Yap</button>
          </form>
        </div>
      </section>
    </main>
  )
}

export default LoginPage
