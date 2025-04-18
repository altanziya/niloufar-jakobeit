# Immersive Web Experience

Ein modernes, animiertes Web-Projekt mit modularer Struktur basierend auf Next.js und TypeScript.

## 🚀 Über das Projekt

Dieses Projekt bietet ein visuell ansprechendes Web-Erlebnis mit sanften Animationen, Parallax-Effekten und einer skalierenden Architektur. Es wurde für einfache Erweiterbarkeit und Wartung entwickelt.

## 📋 Funktionen

- **Modulare Architektur**: Sektions-basierte Struktur für einfache Erweiterbarkeit
- **Animierte Übergänge**: Professionelle Animationen zwischen verschiedenen Sektionen
- **Content-Driven**: Trennung von Inhalten und Komponenten für bessere Wartbarkeit
- **Responsive Design**: Vollständig mobil-optimiert
- **Optimierte Performance**: Effizientes Rendering und Animation

## 🏗️ Technologie-Stack

- **Next.js** (App Router): Modernes React Framework
- **TypeScript**: Für Typsicherheit
- **Tailwind CSS**: Für schnelle, responsive Styles
- **Framer Motion**: Für einfache Komponenten-Animationen
- **GSAP**: Für fortgeschrittene Scrolling-Animationen
- **Lenis**: Für sanftes Scrollen

## 📁 Projektstruktur

```
src/
├── app/                     # Next.js App Router Seiten
│   ├── layout.tsx           # Haupt-Layout mit Metadaten
│   └── page.tsx             # Hauptseite
├── components/              # React-Komponenten
│   ├── common/              # Gemeinsame UI-Elemente (Header, Preloader, etc.)
│   ├── layout/              # Layout-Komponenten (SectionRenderer, ClientLayout)
│   ├── providers/           # Context Provider (Lenis, Theme)
│   ├── sections/            # Sektionskomponenten (Hero, TextMask, etc.)
│   └── transitions/         # Übergangseffekte
├── config/                  # Konfiguration
│   ├── sections.ts          # Sektionsinhalte und Struktur
│   └── sectionRegistry.ts   # Registrierung von Sektionstypen
└── types/                   # TypeScript Typdefinitionen
    └── section.ts           # Sektionstypen
```

## 🛠️ Wie man das Projekt erweitert

### 1. Neue Sektion hinzufügen

1. **Erstelle die Komponente**:
   Füge eine neue React-Komponente in `src/components/sections/` hinzu.

   ```tsx
   // src/components/sections/NewSection.tsx
   import { NewSectionProps } from '@/config/sections';

   const NewSection = ({ title, content }: NewSectionProps) => {
     return (
       <section className="py-24 bg-neutral-800">
         <div className="container mx-auto">
           <h2 className="text-4xl mb-8">{title}</h2>
           <p>{content}</p>
         </div>
       </section>
     );
   };

   export default NewSection;
   ```

2. **Definiere Props**:
   Füge ein Interface in `src/config/sections.ts` hinzu.

   ```tsx
   export interface NewSectionProps {
     title: string;
     content: string;
   }
   ```

3. **Registriere die Komponente**:
   Füge die Komponente zum Registry in `src/config/sectionRegistry.ts` hinzu.

   ```tsx
   import NewSection from '@/components/sections/NewSection';

   export const SectionComponents = {
     // Bestehende Komponenten...
     newSection: NewSection,
   };
   ```

4. **Füge die Sektion zur Konfiguration hinzu**:
   Ergänze die `sections` in `src/config/sections.ts`.

   ```tsx
   export const sections: Section[] = [
     // Bestehende Sektionen...
     {
       id: "new-section",
       type: "newSection",
       props: {
         title: "Meine neue Sektion",
         content: "Hier ist der Inhalt meiner neuen Sektion."
       } as NewSectionProps
     }
   ];
   ```

### 2. Ändern bestehender Inhalte

Um Texte, Bilder oder andere Inhalte zu ändern, bearbeite einfach die Werte in `src/config/sections.ts`. Keine Änderung an Komponenten ist nötig.

### 3. Styling anpassen

Das Projekt verwendet Tailwind CSS. Du kannst Styles direkt in den Komponenten mit Tailwind-Klassen anpassen oder globale Styles in `src/app/globals.css` hinzufügen.

## 🔧 Entwicklung

1. **Installation**:
   ```bash
   npm install
   ```

2. **Entwicklungsserver starten**:
   ```bash
   npm run dev
   ```

3. **Für Produktion bauen**:
   ```bash
   npm run build
   ```

## 💡 Tipps

- **Animationen**: Für bessere Performance, verwende `will-change` nur für aktiv animierte Elemente.
- **Bilder**: Optimiere Bilder vor dem Hinzufügen und verwende Next.js `Image`-Komponente.
- **TypeScript**: Nutze Typ-Guards für bessere Typsicherheit.
- **Responsive**: Teste auf verschiedenen Geräten, da Animation auf mobilen Geräten anders wirken kann.

## 🎨 Animations-Tipps

- Nutze Framer Motion für einfache Animationen
- Komplexere Scroll-basierte Animationen über GSAP implementieren
- Für Text-Animationen die vorhandenen Textkomponenten mit Character-Hover-Effekt verwenden
