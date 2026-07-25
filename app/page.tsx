"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Work = {
  id: number;
  title: string;
  family: string;
  year: string;
  image: string;
  link: string;
};

const works: Work[] = [
  { id: 1, title: "Salt Horizon", family: "Coast", year: "2026", image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=85", link: "https://unsplash.com" },
  { id: 2, title: "Chrome Study", family: "Object", year: "2025", image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=85", link: "https://unsplash.com" },
  { id: 3, title: "Still Water", family: "Coast", year: "2026", image: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1200&q=85", link: "https://unsplash.com" },
  { id: 4, title: "Afterimage", family: "Light", year: "2024", image: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1200&q=85", link: "https://unsplash.com" },
  { id: 5, title: "Soft Geometry", family: "Structure", year: "2025", image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1200&q=85", link: "https://unsplash.com" },
  { id: 6, title: "Blue Interval", family: "Light", year: "2024", image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=85", link: "https://unsplash.com" },
  { id: 7, title: "Field Notes", family: "Earth", year: "2026", image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=85", link: "https://unsplash.com" },
  { id: 8, title: "Quiet Form", family: "Object", year: "2025", image: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=85", link: "https://unsplash.com" },
  { id: 9, title: "Red Passage", family: "Structure", year: "2024", image: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1200&q=85", link: "https://unsplash.com" },
  { id: 10, title: "Low Sun", family: "Coast", year: "2026", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85", link: "https://unsplash.com" },
  { id: 11, title: "Concrete Air", family: "Structure", year: "2025", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85", link: "https://unsplash.com" },
  { id: 12, title: "Night Bloom", family: "Earth", year: "2024", image: "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=1200&q=85", link: "https://unsplash.com" },
  { id: 13, title: "Glass House", family: "Structure", year: "2026", image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85", link: "https://unsplash.com" },
  { id: 14, title: "Pale Distance", family: "Coast", year: "2025", image: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=85", link: "https://unsplash.com" },
  { id: 15, title: "Open Volume", family: "Object", year: "2024", image: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=1200&q=85", link: "https://unsplash.com" },
  { id: 16, title: "Amber Room", family: "Light", year: "2026", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=85", link: "https://unsplash.com" },
  { id: 17, title: "Stone Memory", family: "Earth", year: "2025", image: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1200&q=85", link: "https://unsplash.com" },
  { id: 18, title: "Last Blue", family: "Light", year: "2024", image: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1200&q=85", link: "https://unsplash.com" },
];

const rows = [works.slice(0, 5), works.slice(5, 10), works.slice(10, 14), works.slice(14)];
const ROW_COPIES = 5;

type TickerState = {
  position: number;
  target: number;
  initialized: boolean;
};

export default function Home() {
  const [selected, setSelected] = useState<Work | null>(null);
  const [selectedRow, setSelectedRow] = useState(0);
  const [stage, setStage] = useState<0 | 1 | 2>(0);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const rowTracks = useRef<Array<HTMLDivElement | null>>([]);
  const rowSegments = useRef<Array<HTMLDivElement | null>>([]);
  const tickerState = useRef<TickerState[]>(
    rows.map(() => ({ position: 0, target: 0, initialized: false })),
  );
  const dragState = useRef({
    rowIndex: -1,
    pointerId: -1,
    lastX: 0,
    distance: 0,
  });
  const suppressOpenUntil = useRef(0);

  const family = useMemo(
    () => selected ? works.filter((work) => work.family === selected.family && work.id !== selected.id).slice(0, 4) : [],
    [selected],
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && stage > 0) goBack();
      if (event.key === "ArrowLeft") {
        if (stage > 0) selectRelative(-1);
        else if (hoveredRow !== null) nudgeRow(hoveredRow, -1);
        else return;
        event.preventDefault();
      }
      if (event.key === "ArrowRight") {
        if (stage > 0) selectRelative(1);
        else if (hoveredRow !== null) nudgeRow(hoveredRow, 1);
        else return;
        event.preventDefault();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  useEffect(() => {
    let frame = 0;
    let lastTime = performance.now();
    const speeds = [0.42, 0.32, 0.37, 0.29];

    const animate = (time: number) => {
      const timeScale = Math.min((time - lastTime) / 16.667, 2.5);
      lastTime = time;

      rowTracks.current.forEach((track, rowIndex) => {
        if (!track) return;
        const segment = rowSegments.current[rowIndex];
        const cycleWidth = segment ? segment.offsetWidth + 14 : 0;
        if (!cycleWidth) return;

        const state = tickerState.current[rowIndex];
        const direction = rowIndex % 2 === 0 ? -1 : 1;

        if (!state.initialized) {
          state.position = -cycleWidth * 2;
          state.target = state.position;
          state.initialized = true;
        }

        const ambientStep = direction * speeds[rowIndex] * timeScale;
        state.target += ambientStep;
        state.position += ambientStep;
        state.position += (state.target - state.position) * 0.075;

        while (state.position <= -cycleWidth * 3) {
          state.position += cycleWidth;
          state.target += cycleWidth;
        }
        while (state.position >= -cycleWidth) {
          state.position -= cycleWidth;
          state.target -= cycleWidth;
        }

        track.style.transform = `translate3d(${state.position}px, 0, 0)`;
      });

      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  function openWork(work: Work, rowIndex: number) {
    if (performance.now() < suppressOpenUntil.current) return;
    setSelected(work);
    setSelectedRow(rowIndex);
    setStage(1);
  }

  function goBack() {
    if (stage === 2) setStage(1);
    else {
      setStage(0);
      setSelected(null);
    }
  }

  function advance() {
    if (!selected) return;
    if (stage === 1) setStage(2);
    else window.open(selected.link, "_blank", "noopener,noreferrer");
  }

  function nudgeRow(rowIndex: number, direction: -1 | 1) {
    tickerState.current[rowIndex].target += direction * 230;
  }

  function startDrag(event: React.PointerEvent<HTMLDivElement>, rowIndex: number) {
    if ((event.target as HTMLElement).closest(".row-controls")) return;
    dragState.current = {
      rowIndex,
      pointerId: event.pointerId,
      lastX: event.clientX,
      distance: 0,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.classList.add("is-dragging");
  }

  function moveDrag(event: React.PointerEvent<HTMLDivElement>, rowIndex: number) {
    const drag = dragState.current;
    if (drag.rowIndex !== rowIndex || drag.pointerId !== event.pointerId) return;
    const delta = event.clientX - drag.lastX;
    drag.lastX = event.clientX;
    drag.distance += Math.abs(delta);
    const state = tickerState.current[rowIndex];
    state.position += delta;
    state.target = state.position;
  }

  function endDrag(event: React.PointerEvent<HTMLDivElement>, rowIndex: number) {
    const drag = dragState.current;
    if (drag.rowIndex !== rowIndex || drag.pointerId !== event.pointerId) return;
    if (drag.distance > 5) suppressOpenUntil.current = performance.now() + 180;
    dragState.current = { rowIndex: -1, pointerId: -1, lastX: 0, distance: 0 };
    event.currentTarget.classList.remove("is-dragging");
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  function selectRelative(direction: -1 | 1) {
    if (!selected) return;
    const currentIndex = works.findIndex((work) => work.id === selected.id);
    const nextIndex = (currentIndex + direction + works.length) % works.length;
    const next = works[nextIndex];
    setSelected(next);
    setSelectedRow(rows.findIndex((row) => row.some((work) => work.id === next.id)));
  }

  return (
    <main className={`nume ${stage ? "is-open" : ""} ${stage === 2 ? "is-previewing" : ""}`}>
      <header className="site-header">
        <button className="wordmark" onClick={() => { setStage(0); setSelected(null); }} aria-label="Return to NUME gallery">
          NU<span>M</span>E
        </button>
        <div className="header-note">Independent visual index <i>—</i> 2026</div>
        {stage > 0 && <button className="back" onClick={goBack} aria-label="Go back one step"><span>↖</span> Back</button>}
      </header>

      <section className="gallery" aria-label="NUME image gallery">
        {rows.map((row, rowIndex) => (
          <div
            className={`gallery-row row-${rowIndex + 1} ${rowIndex < selectedRow ? "row-before" : rowIndex > selectedRow ? "row-after" : "row-selected"}`}
            key={rowIndex}
            onPointerEnter={() => setHoveredRow(rowIndex)}
            onPointerLeave={() => setHoveredRow((current) => current === rowIndex ? null : current)}
            onFocusCapture={() => setHoveredRow(rowIndex)}
            onPointerDown={(event) => startDrag(event, rowIndex)}
            onPointerMove={(event) => moveDrag(event, rowIndex)}
            onPointerUp={(event) => endDrag(event, rowIndex)}
            onPointerCancel={(event) => endDrag(event, rowIndex)}
          >
            <div className="row-controls" aria-label={`Move row ${rowIndex + 1}`}>
              <button onClick={() => nudgeRow(rowIndex, -1)} aria-label={`Move row ${rowIndex + 1} left`}>←</button>
              <span>{String(rowIndex + 1).padStart(2, "0")}</span>
              <button onClick={() => nudgeRow(rowIndex, 1)} aria-label={`Move row ${rowIndex + 1} right`}>→</button>
            </div>
            <div
              className="track"
              ref={(element) => { rowTracks.current[rowIndex] = element; }}
            >
              {Array.from({ length: ROW_COPIES }, (_, copyIndex) => (
                <div
                  className="track-segment"
                  key={copyIndex}
                  ref={copyIndex === 0 ? (element) => { rowSegments.current[rowIndex] = element; } : undefined}
                  aria-hidden={copyIndex === 2 ? undefined : true}
                >
                  {row.map((work, itemIndex) => (
                    <button
                      className={`tile tile-${itemIndex}`}
                      key={`${work.id}-${copyIndex}`}
                      onClick={() => openWork(work, rowIndex)}
                      aria-label={`Open ${work.title}`}
                      tabIndex={copyIndex === 2 ? 0 : -1}
                      draggable={false}
                    >
                      <img src={work.image} alt="" loading={rowIndex > 1 ? "lazy" : "eager"} draggable={false} />
                      <span className="tile-meta"><b>{work.title}</b><em>{String(work.id).padStart(2, "0")}</em></span>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {selected && stage > 0 && (
        <section className="reveal-band" aria-live="polite">
          <div className="band-line top-line" />
          <div className="family-rail" aria-label={`${selected.family} collection`}>
            {family.slice(0, 2).map((work, index) => (
              <button className={`family-card family-left family-${index}`} key={work.id} onClick={() => setSelected(work)}>
                <img src={work.image} alt={work.title} />
              </button>
            ))}
          </div>

          <div className={`hero-wrap ${selectedRow % 2 ? "preview-left" : "preview-right"}`}>
            <button className="hero-nav hero-prev" onClick={() => selectRelative(-1)} aria-label="Previous image">
              <span>←</span><em>Previous</em>
            </button>
            <button className="hero" onClick={advance} aria-label={stage === 1 ? `Preview website for ${selected.title}` : `Visit website for ${selected.title}`}>
              <img src={selected.image} alt={selected.title} />
              <span className="hero-index">{String(selected.id).padStart(2, "0")}</span>
              <span className="hero-action">{stage === 1 ? "Open preview" : "Visit source"} <i>↗</i></span>
            </button>

            <div className="work-copy">
              <p>{selected.family} / {selected.year}</p>
              <h1>{selected.title}</h1>
              <span>{stage === 1 ? "Selected work" : "Source preview"}</span>
            </div>

            {stage === 2 && (
              <div className="site-preview">
                <div className="preview-bar">
                  <span>{selected.title.toLowerCase().replace(" ", "-")}.studio</span>
                  <i>•••</i>
                </div>
                <div className="preview-page">
                  <span>NUME / SOURCE {String(selected.id).padStart(2, "0")}</span>
                  <h2>{selected.title}</h2>
                  <p>A study in material, atmosphere and quiet movement.</p>
                  <a href={selected.link} target="_blank" rel="noreferrer">Enter project ↗</a>
                </div>
              </div>
            )}
            <button className="hero-nav hero-next" onClick={() => selectRelative(1)} aria-label="Next image">
              <em>Next</em><span>→</span>
            </button>
          </div>

          <div className="family-rail family-rail-right">
            {family.slice(2, 4).map((work, index) => (
              <button className={`family-card family-right family-${index}`} key={work.id} onClick={() => setSelected(work)}>
                <img src={work.image} alt={work.title} />
              </button>
            ))}
          </div>
          <div className="band-line bottom-line" />
        </section>
      )}

      <footer>
        <span>Scroll to explore</span>
        <span>Visual archive / 001—018</span>
      </footer>
    </main>
  );
}
