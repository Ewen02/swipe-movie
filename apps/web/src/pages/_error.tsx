import { NextPageContext } from "next"

interface ErrorProps {
  statusCode: number
  locale: string
}

const translations = {
  fr: {
    "404": {
      badge: "Page non trouvée",
      title: "Page introuvable",
      description: "La page que vous recherchez n'existe pas ou a été déplacée.",
    },
    "500": {
      badge: "Erreur serveur",
      title: "Une erreur est survenue",
      description: "Nous sommes désolés, quelque chose s'est mal passé.",
    },
    back: "Retour",
    home: "Accueil",
  },
  en: {
    "404": {
      badge: "Page not found",
      title: "Page not found",
      description: "The page you're looking for doesn't exist or has been moved.",
    },
    "500": {
      badge: "Server error",
      title: "An error occurred",
      description: "We're sorry, something went wrong.",
    },
    back: "Back",
    home: "Home",
  },
}

function Error({ statusCode, locale }: ErrorProps) {
  const is404 = statusCode === 404
  const t = translations[locale as keyof typeof translations] || translations.fr
  const errorKey = is404 ? "404" : "500"

  return (
    <html lang={locale}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{statusCode} - Swipe Movie</title>
        <style>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: hsl(240 10% 3.9%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem;
            color: hsl(0 0% 98%);
            overflow: hidden;
          }

          /* Background gradient orbs like landing page */
          .orb {
            position: fixed;
            border-radius: 50%;
            filter: blur(80px);
            pointer-events: none;
            z-index: 0;
          }
          .orb-1 {
            width: 384px;
            height: 384px;
            background: hsl(262.1 83.3% 57.8% / 0.1);
            top: 10%;
            left: 25%;
          }
          .orb-2 {
            width: 384px;
            height: 384px;
            background: hsl(330 81% 60% / 0.1);
            bottom: 10%;
            right: 25%;
          }
          .orb-3 {
            width: 128px;
            height: 128px;
            background: hsl(262.1 83.3% 57.8% / 0.2);
            top: -40px;
            left: -40px;
          }
          .orb-4 {
            width: 128px;
            height: 128px;
            background: hsl(330 81% 60% / 0.2);
            bottom: -40px;
            right: -40px;
          }

          .container {
            position: relative;
            z-index: 1;
            max-width: 500px;
            width: 100%;
          }

          /* Card with glassmorphism like landing page */
          .card {
            position: relative;
            background: linear-gradient(to bottom right, hsl(240 10% 3.9% / 0.95), hsl(240 10% 3.9% / 0.8));
            backdrop-filter: blur(24px);
            -webkit-backdrop-filter: blur(24px);
            border: 1px solid hsl(0 0% 100% / 0.1);
            border-radius: 24px;
            overflow: hidden;
          }

          /* Top gradient bar */
          .gradient-bar {
            height: 4px;
            background: linear-gradient(to right, hsl(262.1 83.3% 57.8%), hsl(330 81% 60%), hsl(262.1 83.3% 57.8%));
          }

          .card-content {
            padding: 3rem 2rem;
            text-align: center;
          }

          /* Icon with gradient background */
          .icon-wrapper {
            width: 64px;
            height: 64px;
            margin: 0 auto 1.5rem;
            background: linear-gradient(135deg, hsl(262.1 83.3% 57.8%), hsl(330 81% 60%));
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 8px 32px hsl(262.1 83.3% 57.8% / 0.4);
          }

          /* Status code with gradient text */
          .status-code {
            font-size: 5rem;
            font-weight: 700;
            background: linear-gradient(135deg, hsl(262.1 83.3% 57.8%), hsl(330 81% 60%));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            line-height: 1;
            margin-bottom: 1rem;
          }

          .title {
            font-size: 1.5rem;
            font-weight: 600;
            color: hsl(0 0% 98%);
            margin-bottom: 0.5rem;
          }

          .description {
            color: hsl(240 5% 64.9%);
            font-size: 1rem;
            margin-bottom: 2rem;
            line-height: 1.6;
          }

          .buttons {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
          }

          .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            padding: 0.875rem 1.75rem;
            font-weight: 500;
            font-size: 1rem;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            text-decoration: none;
            transition: all 0.2s ease;
          }

          .btn-primary {
            background: linear-gradient(135deg, hsl(262.1 83.3% 57.8%), hsl(262.1 83.3% 50%));
            color: hsl(0 0% 100%);
            box-shadow: 0 4px 14px hsl(262.1 83.3% 57.8% / 0.25);
          }
          .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px hsl(262.1 83.3% 57.8% / 0.35);
          }

          .btn-secondary {
            background: hsl(0 0% 100% / 0.05);
            color: hsl(0 0% 98%);
            border: 1px solid hsl(0 0% 100% / 0.2);
          }
          .btn-secondary:hover {
            background: hsl(0 0% 100% / 0.1);
            border-color: hsl(0 0% 100% / 0.3);
          }

          /* Badge like landing page */
          .badge {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem;
            background: hsl(262.1 83.3% 57.8% / 0.1);
            border-radius: 9999px;
            color: hsl(262.1 83.3% 57.8%);
            font-size: 0.875rem;
            font-weight: 500;
            margin-bottom: 1.5rem;
          }

          @media (min-width: 480px) {
            .buttons {
              flex-direction: row;
            }
            .btn {
              flex: 1;
            }
          }
        `}</style>
      </head>
      <body>
        {/* Background orbs */}
        <div className="orb orb-1" />
        <div className="orb orb-2" />

        <div className="container">
          {/* Decorative orbs around card */}
          <div className="orb orb-3" />
          <div className="orb orb-4" />

          <div className="card">
            {/* Gradient bar at top */}
            <div className="gradient-bar" />

            <div className="card-content">
              {/* Badge */}
              <div className="badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
                {t[errorKey].badge}
              </div>

              {/* Icon */}
              <div className="icon-wrapper">
                {is404 ? (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                    <path d="M8 8l6 6" />
                    <path d="M14 8l-6 6" />
                  </svg>
                ) : (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                    <path d="M12 9v4" />
                    <path d="M12 17h.01" />
                  </svg>
                )}
              </div>

              {/* Status code */}
              <div className="status-code">{statusCode}</div>

              {/* Title & description */}
              <h1 className="title">{t[errorKey].title}</h1>
              <p className="description">{t[errorKey].description}</p>

              {/* Buttons */}
              <div className="buttons">
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      if (window.history.length > 1) {
                        window.history.back()
                      } else {
                        window.location.href = '/'
                      }
                    }
                  }}
                  className="btn btn-primary"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m12 19-7-7 7-7" />
                    <path d="M19 12H5" />
                  </svg>
                  {t.back}
                </button>
                <a href={`/${locale}`} className="btn btn-secondary">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                  {t.home}
                </a>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}

Error.getInitialProps = ({ res, err, asPath }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404

  // Extract locale from URL path (e.g., /fr/... or /en/...)
  const pathLocale = asPath?.split('/')[1]
  const locale = ['fr', 'en'].includes(pathLocale || '') ? pathLocale : 'fr'

  return { statusCode: statusCode || 500, locale }
}

export default Error
