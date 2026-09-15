'use client';

import React, { useState, useEffect } from 'react';
import { f1Api } from '@/lib/api';
import { RadioMessage } from '@/lib/types';
import { useTelemetryStore } from '@/lib/store';
import { Radio, Play, Pause } from 'lucide-react';

export function RadioPlayer() {
  const { selectedSession } = useTelemetryStore();
  const [messages, setMessages] = useState<RadioMessage[]>([]);
  const [activeMessage, setActiveMessage] = useState<RadioMessage | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  useEffect(() => {
    async function loadRadio() {
      const data = await f1Api.getRadioTimeline(selectedSession?.id || 1);
      setMessages(data);
      if (data.length > 0) setActiveMessage(data[0]);
    }
    loadRadio();
  }, [selectedSession?.id]);

  const toggleAudio = (msg: RadioMessage) => {
    if (activeMessage?.id === msg.id && isPlayingAudio) {
      setIsPlayingAudio(false);
    } else {
      setActiveMessage(msg);
      setIsPlayingAudio(true);
    }
  };

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'ANGER':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      case 'CONFIDENT':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'TACTICAL':
        return 'text-amber-300 bg-amber-500/10 border-amber-500/20';
      default:
        return 'text-cyan-300 bg-cyan-500/10 border-cyan-500/20';
    }
  };

  return (
    <div className="w-full ios-card p-6 rounded-3xl flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.06] pb-3">
        <div className="flex items-center gap-2.5">
          <Radio className="w-4 h-4 text-white stroke-[2]" />
          <div>
            <h2 className="font-semibold text-sm text-white tracking-tight">
              Team Radio Timeline
            </h2>
          </div>
        </div>

        <span className="text-[11px] font-mono text-neutral-500">
          {messages.length} Captures
        </span>
      </div>

      {/* Active Message Hero Card */}
      {activeMessage && (
        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span
                className="w-1.5 h-7 rounded-full"
                style={{ backgroundColor: activeMessage.driver?.color_hex || '#FF8000' }}
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-white">
                    {activeMessage.driver?.broadcast_name}
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400">
                    LAP {activeMessage.lap_number}
                  </span>
                </div>
                <span className="text-[11px] text-neutral-500">{activeMessage.driver?.team_name}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] px-2.5 py-0.5 rounded-full font-mono font-medium border ${getSentimentColor(
                  activeMessage.sentiment
                )}`}
              >
                {activeMessage.sentiment}
              </span>

              <button
                onClick={() => toggleAudio(activeMessage)}
                className="p-2.5 rounded-full bg-white text-black hover:bg-neutral-200 transition-transform active:scale-95 shadow-md"
              >
                {isPlayingAudio ? (
                  <Pause className="w-3.5 h-3.5 fill-current" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                )}
              </button>
            </div>
          </div>

          <p className="font-mono text-xs text-neutral-200 italic px-2">
            &ldquo;{activeMessage.transcript}&rdquo;
          </p>

          {/* Minimal Waveform */}
          <div className="flex items-center gap-1 h-5 pt-1">
            {Array.from({ length: 28 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 bg-white/20 rounded-full transition-all duration-150"
                style={{
                  height: isPlayingAudio ? `${Math.sin(i * 0.4 + Date.now() * 0.01) * 8 + 10}px` : '3px',
                  opacity: isPlayingAudio ? 0.8 : 0.2,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Feed List */}
      <div className="space-y-1.5 max-h-[300px] overflow-y-auto">
        {messages.map((msg) => {
          const isSelected = activeMessage?.id === msg.id;
          return (
            <div
              key={msg.id}
              onClick={() => setActiveMessage(msg)}
              className={`p-3 rounded-2xl transition-all cursor-pointer flex items-center justify-between gap-4 border ${
                isSelected
                  ? 'bg-white/[0.08] border-white/[0.16]'
                  : 'bg-white/[0.01] border-transparent hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className="w-1.5 h-5 rounded-full shrink-0"
                  style={{ backgroundColor: msg.driver?.color_hex || '#FF8000' }}
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-xs text-white">
                      {msg.driver?.broadcast_name}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-500">
                      L{msg.lap_number}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400 truncate">
                    {msg.transcript}
                  </p>
                </div>
              </div>

              <span
                className={`text-[9px] px-2 py-0.5 rounded-full font-mono shrink-0 border ${getSentimentColor(
                  msg.sentiment
                )}`}
              >
                {msg.sentiment}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
