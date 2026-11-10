# TopBook (React + Tailwind 4 + Vite)

A landing cinematográfica e as 5 telas de conta do TopBook.

## Rodar

```bash
npm install
npm run dev
```

Abra o endereço que o Vite mostrar (normalmente http://localhost:5173).

## Rotas

| Rota | Tela |
| --- | --- |
| `/` | Landing: vídeos controlados pela rolagem e a tela final "Sua próxima história começa aqui." |
| `/entrar` | Entrar |
| `/cadastro` | Criar conta |
| `/esqueci-senha` | Esqueci minha senha (etapa 1: e-mail) |
| `/esqueci-senha/codigo` | Código de 6 dígitos (etapa 2) |
| `/esqueci-senha/nova-senha` | Código verificado e nova senha (etapa 3) |

Os botões da tela final ("Criar minha conta" e "Já tenho conta") abrem a transição da fada antes de navegar.

## Estrutura

- `src/App.jsx`: rotas. As telas de conta ficam numa rota-layout, então o fundo continua rodando e só o cartão troca.
- `src/pages/Landing.jsx`: a landing. As janelas de cada vídeo ficam em `VIDEOS` e as cores do texto em `TEXT_COLORS`.
- `src/pages/*.jsx`: as telas de conta. Cada uma aceita callbacks para ligar ao backend (`onLogin`, `onSignup`, `onRequestCode`, `onVerify`, `onResend`, `onReset`).
- `src/components/AuthShell.jsx`: fundo, logo, cartão de vidro e a navegação com transição (`TransitionLink`, `useAuthGo`).
- `src/components/`: `BackgroundCycle`, `GlassCard`, `MagicTrails`, `FlowerCheckbox`, `OtpInput`, `TextField`.
- `src/index.css`: tokens do design system (`@theme`) e todas as animações.
- `public/videos/`: vídeos em 1280px (desktop) e 854px (celular), com quadros-chave a cada 6 frames para a rolagem ficar suave.
- `public/images/`: fundos, logo, fada e cena final.

## Publicar

Como é uma SPA com rotas, configure o servidor para devolver `index.html` em qualquer caminho (na Vercel e na Netlify isso é um rewrite de `/*` para `/index.html`).
