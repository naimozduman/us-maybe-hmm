"use client";

import * as React from "react";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  CircleAlert,
  Clock3,
  Heart,
  Languages,
  LoaderCircle,
  LockKeyhole,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { Progress } from "@/components/ui/Progress";
import { Textarea } from "@/components/ui/Input";
import { CHAPTERS, QUESTION_MAP, QUESTIONS, isQuestionVisible, localize, questionsForChapter, validateAnswer, visibleMainQuestions } from "@/lib/questionnaire";
import { LANGUAGE_META } from "@/lib/constants";
import { PROFILE_TRAITS, UI_COPY, uiText } from "@/lib/copy";
import type { AnswerValue, Language, PublicBootstrap, QuestionDefinition, StoredAnswer } from "@/lib/types";
import { LANGUAGES } from "@/lib/types";
import { cn } from "@/lib/utils";

type Stage =
  | "loading"
  | "language"
  | "welcome"
  | "consent"
  | "profile"
  | "gate"
  | "chapter"
  | "question"
  | "submitted"
  | "exit"
  | "deleted"
  | "error";

type SaveState = "idle" | "saving" | "saved" | "error";

type PublicEvent = {
  eventType: string;
  screenId?: string | null;
  questionId?: string | null;
  payload?: Record<string, unknown>;
  occurredAt?: string;
};

function hasValue(value: AnswerValue | undefined) {
  return typeof value === "string" ? value.trim().length > 0 : Array.isArray(value) && value.length > 0;
}

function asRecord(answers: StoredAnswer[]) {
  return Object.fromEntries(answers.map((answer) => [answer.questionId, answer.value])) as Record<string, AnswerValue>;
}

function hardStopFor(question: QuestionDefinition, value: AnswerValue) {
  if (Array.isArray(value)) return question.options?.find((option) => value.includes(option.id) && option.hardStop)?.hardStop ?? null;
  return question.options?.find((option) => option.id === value)?.hardStop ?? null;
}

function IconStamp({ children }: { children: React.ReactNode }) {
  return <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">{children}</div>;
}

export function InvitationExperience({ token }: { token: string }) {
  const [stage, setStage] = React.useState<Stage>("loading");
  const [bootstrap, setBootstrap] = React.useState<PublicBootstrap | null>(null);
  const [language, setLanguage] = React.useState<Language>("en");
  const [answers, setAnswers] = React.useState<StoredAnswer[]>([]);
  const [activeQuestionId, setActiveQuestionId] = React.useState<string | null>(null);
  const [activeChapterId, setActiveChapterId] = React.useState<string>(CHAPTERS[0].id);
  const [gateIndex, setGateIndex] = React.useState(0);
  const [saveState, setSaveState] = React.useState<SaveState>("idle");
  const [errorMessage, setErrorMessage] = React.useState("");
  const [validationMessage, setValidationMessage] = React.useState("");
  const [exitReason, setExitReason] = React.useState<string | null>(null);
  const [languageOpen, setLanguageOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const textTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const mounted = React.useRef(true);

  const answerRecord = React.useMemo(() => asRecord(answers), [answers]);
  const mainQuestions = React.useMemo(() => visibleMainQuestions(answerRecord), [answerRecord]);
  const answeredMain = React.useMemo(
    () => mainQuestions.filter((question) => hasValue(answerRecord[question.id])).length,
    [mainQuestions, answerRecord],
  );
  const progress = mainQuestions.length ? Math.round((answeredMain / mainQuestions.length) * 100) : 0;
  const direction = LANGUAGE_META[language].dir;
  const copy = React.useCallback((value: (typeof UI_COPY)[keyof typeof UI_COPY], replacements?: Record<string, string>) => uiText(value, language, replacements), [language]);

  const setAnswerLocal = React.useCallback((questionId: string, value: AnswerValue, isDraft: boolean) => {
    setAnswers((current) => {
      const next = current.filter((item) => item.questionId !== questionId);
      next.push({ questionId, value, language, isDraft, updatedAt: new Date().toISOString() });
      return next;
    });
  }, [language]);

  const sendEvent = React.useCallback(async (
    events: PublicEvent | PublicEvent[],
    context?: { currentStage?: string | null; currentQuestion?: string | null; progress?: number; selectedLanguage?: Language },
  ) => {
    if (!bootstrap?.invitationId) return;
    try {
      await fetch("/api/public/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        body: JSON.stringify({
          invitationId: bootstrap.invitationId,
          events: Array.isArray(events) ? events : [events],
          currentStage: context?.currentStage,
          currentQuestion: context?.currentQuestion,
          progress: context?.progress,
          language: context?.selectedLanguage,
        }),
      });
    } catch {
      // Activity tracking should never block the questionnaire.
    }
  }, [bootstrap?.invitationId]);

  const saveAnswer = React.useCallback(async (questionId: string, value: AnswerValue, isDraft: boolean) => {
    if (!bootstrap?.invitationId) return false;
    setSaveState("saving");
    setAnswerLocal(questionId, value, isDraft);
    try {
      const response = await fetch("/api/public/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invitationId: bootstrap.invitationId, questionId, value, language, isDraft }),
      });
      if (!response.ok) throw new Error((await response.json().catch(() => null))?.error ?? "Save failed");
      if (mounted.current) {
        setSaveState("saved");
        window.setTimeout(() => mounted.current && setSaveState("idle"), 1800);
      }
      return true;
    } catch {
      if (mounted.current) setSaveState("error");
      return false;
    }
  }, [bootstrap?.invitationId, language, setAnswerLocal]);

  const bootstrapInvitation = React.useCallback(async (preferred?: Language) => {
    setStage("loading");
    setErrorMessage("");
    try {
      const response = await fetch("/api/public/bootstrap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ token, language: preferred }),
      });
      const data = await response.json();
      if (!response.ok) {
        setErrorMessage(data.code === "INVITATION_EXPIRED" ? uiText(UI_COPY.expired, preferred ?? "en") : uiText(UI_COPY.invalid, preferred ?? "en"));
        setStage("error");
        return;
      }
      const payload = data as PublicBootstrap;
      setBootstrap(payload);
      setAnswers(payload.answers ?? []);
      const initialLanguage = preferred ?? payload.selectedLanguage ?? payload.preferredLanguage ?? "en";
      setLanguage(initialLanguage);
      localStorage.setItem(`usmaybe-language:${token.slice(0, 12)}`, initialLanguage);

      if (payload.withdrawn) setStage("deleted");
      else if (payload.submitted) setStage("submitted");
      else if (!payload.selectedLanguage && !preferred) setStage("language");
      else if (!payload.consented) setStage("welcome");
      else {
        const record = asRecord(payload.answers ?? []);
        const gates = QUESTIONS.filter((question) => question.gate);
        const firstMissingGate = gates.findIndex((question) => !hasValue(record[question.id]));
        if (firstMissingGate >= 0) {
          setGateIndex(firstMissingGate);
          setStage("gate");
        } else {
          const visible = visibleMainQuestions(record);
          const resume = payload.session?.currentQuestion && visible.some((question) => question.id === payload.session?.currentQuestion)
            ? payload.session.currentQuestion
            : visible.find((question) => !hasValue(record[question.id]))?.id;
          if (resume) {
            const question = QUESTION_MAP.get(resume);
            setActiveQuestionId(resume);
            setActiveChapterId(question?.chapter ?? CHAPTERS[0].id);
            setStage("question");
          } else {
            setActiveChapterId(CHAPTERS[0].id);
            setStage("chapter");
          }
        }
      }
    } catch {
      setErrorMessage(uiText(UI_COPY.invalid, preferred ?? "en"));
      setStage("error");
    }
  }, [token]);

  React.useEffect(() => {
    mounted.current = true;
    const remembered = localStorage.getItem(`usmaybe-language:${token.slice(0, 12)}`) as Language | null;
    void bootstrapInvitation(remembered && LANGUAGES.includes(remembered) ? remembered : undefined);
    return () => {
      mounted.current = false;
      if (textTimer.current) clearTimeout(textTimer.current);
    };
  }, [bootstrapInvitation, token]);

  React.useEffect(() => {
    if (!bootstrap?.consented || ["submitted", "deleted", "exit", "error"].includes(stage)) return;
    const heartbeat = window.setInterval(() => {
      void sendEvent({ eventType: "heartbeat", screenId: stage }, { currentStage: stage, currentQuestion: activeQuestionId, progress });
    }, 25000);
    const visibility = () => {
      const hidden = document.visibilityState === "hidden";
      void sendEvent(
        { eventType: hidden ? "visibility_hidden" : "visibility_visible", screenId: stage, questionId: activeQuestionId },
        { currentStage: stage, currentQuestion: activeQuestionId, progress },
      );
    };
    document.addEventListener("visibilitychange", visibility);
    return () => {
      window.clearInterval(heartbeat);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [activeQuestionId, bootstrap?.consented, progress, sendEvent, stage]);

  React.useEffect(() => {
    if (stage !== "question" || !activeQuestionId || !bootstrap?.consented) return;
    void sendEvent(
      { eventType: "question_viewed", screenId: "question", questionId: activeQuestionId },
      { currentStage: "question", currentQuestion: activeQuestionId, progress },
    );
  }, [activeQuestionId, bootstrap?.consented, progress, sendEvent, stage]);

  const selectLanguage = async (next: Language) => {
    setLanguage(next);
    setLanguageOpen(false);
    localStorage.setItem(`usmaybe-language:${token.slice(0, 12)}`, next);
    if (!bootstrap) {
      await bootstrapInvitation(next);
      return;
    }
    await sendEvent({ eventType: "language_selected", screenId: "language", payload: { language: next } }, { selectedLanguage: next, currentStage: stage });
    if (stage === "language") setStage("welcome");
  };

  const acceptWelcome = () => {
    setStage("consent");
    void sendEvent({ eventType: "welcome_started", screenId: "welcome" }, { currentStage: "consent", selectedLanguage: language });
  };

  const declineWelcome = () => {
    setExitReason("not_for_me");
    setStage("exit");
    void sendEvent({ eventType: "consent_declined", screenId: "welcome", payload: { reason: "not_for_me" } }, { currentStage: "exit" });
  };

  const acceptConsent = async () => {
    await sendEvent({ eventType: "consent_accepted", screenId: "consent" }, { currentStage: "profile", selectedLanguage: language });
    setBootstrap((current) => current ? { ...current, consented: true } : current);
    setStage("profile");
  };

  const declineConsent = () => {
    setExitReason("consent_declined");
    setStage("exit");
    void sendEvent({ eventType: "consent_declined", screenId: "consent", payload: { reason: "consent_declined" } }, { currentStage: "exit" });
  };

  const startGates = () => {
    const gates = QUESTIONS.filter((question) => question.gate);
    const firstMissing = gates.findIndex((question) => !hasValue(answerRecord[question.id]));
    setGateIndex(firstMissing >= 0 ? firstMissing : 0);
    setStage("gate");
    void sendEvent({ eventType: "profile_completed", screenId: "profile" }, { currentStage: "gate", progress });
  };

  const chooseOption = async (question: QuestionDefinition, optionId: string) => {
    const previous = answerRecord[question.id];
    let next: AnswerValue;
    if (question.type === "multi") {
      const current = Array.isArray(previous) ? previous : [];
      next = current.includes(optionId) ? current.filter((item) => item !== optionId) : [...current, optionId];
    } else {
      next = optionId;
    }
    setValidationMessage("");
    setAnswerLocal(question.id, next, false);
    await Promise.all([
      saveAnswer(question.id, next, false),
      sendEvent(
        {
          eventType: hasValue(previous) ? "answer_changed" : "option_selected",
          screenId: "question",
          questionId: question.id,
          payload: { optionId, value: next },
        },
        { currentStage: stage, currentQuestion: question.id, progress },
      ),
    ]);
  };

  const changeText = (question: QuestionDefinition, value: string) => {
    setValidationMessage("");
    setAnswerLocal(question.id, value, true);
    setSaveState("saving");
    if (textTimer.current) clearTimeout(textTimer.current);
    textTimer.current = setTimeout(() => {
      void Promise.all([
        saveAnswer(question.id, value, true),
        sendEvent(
          { eventType: "draft_saved", screenId: "question", questionId: question.id, payload: { characterCount: value.length } },
          { currentStage: "question", currentQuestion: question.id, progress },
        ),
      ]);
    }, 900);
  };

  const processHardStop = async (question: QuestionDefinition, value: AnswerValue) => {
    const reason = hardStopFor(question, value);
    if (!reason) return false;
    setExitReason(reason);
    setStage("exit");
    await sendEvent({ eventType: "early_exit", screenId: "gate", questionId: question.id, payload: { reason } }, { currentStage: "exit", currentQuestion: question.id, progress });
    return true;
  };

  const nextGate = async () => {
    const gates = QUESTIONS.filter((question) => question.gate);
    const question = gates[gateIndex];
    const value = answerRecord[question.id];
    const invalid = validateAnswer(question, value);
    if (invalid) {
      setValidationMessage(copy(UI_COPY.required));
      return;
    }
    if (!value) return;
    await saveAnswer(question.id, value, false);
    if (await processHardStop(question, value)) return;

    if (gateIndex < gates.length - 1) {
      setGateIndex((current) => current + 1);
      void sendEvent({ eventType: "next_pressed", screenId: "gate", questionId: question.id }, { currentStage: "gate", currentQuestion: gates[gateIndex + 1].id, progress });
    } else {
      setActiveChapterId(CHAPTERS[0].id);
      setStage("chapter");
      void sendEvent({ eventType: "gates_completed", screenId: "gate" }, { currentStage: "chapter", progress });
    }
  };

  const startChapter = () => {
    const chapterQuestions = questionsForChapter(activeChapterId, answerRecord);
    const nextQuestion = chapterQuestions.find((question) => !hasValue(answerRecord[question.id])) ?? chapterQuestions[0];
    if (!nextQuestion) return;
    setActiveQuestionId(nextQuestion.id);
    setStage("question");
    void sendEvent(
      { eventType: "chapter_started", screenId: "chapter", payload: { chapterId: activeChapterId } },
      { currentStage: "question", currentQuestion: nextQuestion.id, progress },
    );
  };

  const goToNextQuestion = async () => {
    if (!activeQuestionId) return;
    const question = QUESTION_MAP.get(activeQuestionId);
    if (!question) return;
    const value = answerRecord[question.id];
    const invalid = validateAnswer(question, value);
    if (invalid) {
      setValidationMessage(invalid === "too_short" ? copy(UI_COPY.tooShort) : copy(UI_COPY.required));
      return;
    }
    if (value !== undefined) {
      if (textTimer.current) clearTimeout(textTimer.current);
      const saved = await saveAnswer(question.id, value, false);
      if (!saved) {
        setValidationMessage("Your answer is still on this device, but it could not be saved. Check your connection and try again.");
        return;
      }
    }

    const currentChapterQuestions = questionsForChapter(activeChapterId, { ...answerRecord, [question.id]: value ?? "" });
    const currentIndex = currentChapterQuestions.findIndex((item) => item.id === question.id);
    const nextQuestion = currentChapterQuestions[currentIndex + 1];
    await sendEvent({ eventType: "next_pressed", screenId: "question", questionId: question.id }, { currentStage: nextQuestion ? "question" : "chapter", currentQuestion: nextQuestion?.id ?? null, progress });

    if (nextQuestion) {
      setActiveQuestionId(nextQuestion.id);
      return;
    }

    await sendEvent({ eventType: "chapter_completed", screenId: "chapter", payload: { chapterId: activeChapterId } }, { currentStage: "chapter", progress });
    const chapterIndex = CHAPTERS.findIndex((chapter) => chapter.id === activeChapterId);
    const nextChapter = CHAPTERS[chapterIndex + 1];
    if (nextChapter) {
      setActiveChapterId(nextChapter.id);
      setActiveQuestionId(null);
      setStage("chapter");
      return;
    }

    await submitAnswers();
  };

  const goBack = () => {
    if (stage === "gate") {
      if (gateIndex > 0) setGateIndex((current) => current - 1);
      else setStage("profile");
      void sendEvent({ eventType: "back_pressed", screenId: "gate" }, { currentStage: gateIndex > 0 ? "gate" : "profile", progress });
      return;
    }
    if (stage !== "question" || !activeQuestionId) return;
    const currentChapterQuestions = questionsForChapter(activeChapterId, answerRecord);
    const currentIndex = currentChapterQuestions.findIndex((question) => question.id === activeQuestionId);
    if (currentIndex > 0) {
      const previous = currentChapterQuestions[currentIndex - 1];
      setActiveQuestionId(previous.id);
      void sendEvent({ eventType: "back_pressed", screenId: "question", questionId: activeQuestionId }, { currentStage: "question", currentQuestion: previous.id, progress });
      return;
    }
    const chapterIndex = CHAPTERS.findIndex((chapter) => chapter.id === activeChapterId);
    if (chapterIndex > 0) {
      const previousChapter = CHAPTERS[chapterIndex - 1];
      const previousQuestions = questionsForChapter(previousChapter.id, answerRecord);
      const previous = previousQuestions[previousQuestions.length - 1];
      setActiveChapterId(previousChapter.id);
      setActiveQuestionId(previous?.id ?? null);
      setStage(previous ? "question" : "chapter");
      void sendEvent({ eventType: "back_pressed", screenId: "question", questionId: activeQuestionId }, { currentStage: previous ? "question" : "chapter", currentQuestion: previous?.id ?? null, progress });
    } else {
      setStage("chapter");
      setActiveQuestionId(null);
    }
  };

  const submitAnswers = async () => {
    if (!bootstrap?.invitationId) return;
    setSubmitting(true);
    setValidationMessage("");
    try {
      const response = await fetch("/api/public/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invitationId: bootstrap.invitationId }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        if (Array.isArray(data?.missing) && data.missing.length) {
          const firstMissing = data.missing[0] as string;
          const missingQuestion = QUESTION_MAP.get(firstMissing);
          if (missingQuestion) {
            setActiveChapterId(missingQuestion.chapter);
            setActiveQuestionId(firstMissing);
            setStage("question");
          }
          setValidationMessage(copy(UI_COPY.required));
        } else {
          setValidationMessage(data?.error ?? "Submission failed. Please try again.");
        }
        return;
      }
      setStage("submitted");
      setBootstrap((current) => current ? { ...current, submitted: true, status: "submitted" } : current);
    } catch {
      setValidationMessage("Submission failed. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteEverything = async () => {
    if (!bootstrap?.invitationId) return;
    setDeleting(true);
    try {
      const response = await fetch("/api/public/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invitationId: bootstrap.invitationId }),
      });
      if (!response.ok) throw new Error("Delete failed");
      setAnswers([]);
      setDeleteOpen(false);
      setStage("deleted");
    } catch {
      setValidationMessage("Your information could not be deleted. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const activeQuestion = activeQuestionId ? QUESTION_MAP.get(activeQuestionId) ?? null : null;
  const currentGate = QUESTIONS.filter((question) => question.gate)[gateIndex] ?? null;
  const chapter = CHAPTERS.find((item) => item.id === activeChapterId) ?? CHAPTERS[0];

  return (
    <main dir={direction} className="min-h-screen px-3 py-3 sm:px-6 sm:py-6">
      <div className="mx-auto flex min-h-[calc(100vh-1.5rem)] max-w-5xl flex-col overflow-hidden rounded-[28px] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)] sm:min-h-[calc(100vh-3rem)]">
        <header className="relative z-20 flex min-h-16 items-center justify-between gap-3 border-b border-[var(--border)] px-4 sm:px-7">
          <div className="font-[family-name:var(--font-serif)] text-lg font-semibold tracking-[-0.02em]">Us, Maybe?</div>
          <div className="flex items-center gap-2">
            {bootstrap?.consented && !["loading", "error", "deleted"].includes(stage) ? (
              <div className="hidden items-center gap-2 text-xs font-semibold text-[var(--muted)] sm:flex">
                {saveState === "saving" ? <LoaderCircle className="size-3.5 animate-spin" /> : saveState === "error" ? <CircleAlert className="size-3.5 text-[var(--danger)]" /> : <Check className="size-3.5 text-[var(--sage)]" />}
                {saveState === "saving" ? copy(UI_COPY.saving) : saveState === "error" ? "Save interrupted" : copy(UI_COPY.saveStatus)}
              </div>
            ) : null}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLanguageOpen((current) => !current)}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--border)] bg-white px-3 text-sm font-bold transition hover:border-[var(--accent)]"
                aria-expanded={languageOpen}
              >
                <Languages className="size-4" aria-hidden="true" />
                <span className="hidden sm:inline">{LANGUAGE_META[language].native}</span>
                <ChevronDown className="size-4" aria-hidden="true" />
              </button>
              {languageOpen ? (
                <div className="absolute end-0 top-12 z-30 w-56 overflow-hidden rounded-2xl border border-[var(--border)] bg-white p-1.5 shadow-xl">
                  {LANGUAGES.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => void selectLanguage(item)}
                      className={cn("flex min-h-11 w-full items-center justify-between rounded-xl px-3 text-start text-sm font-semibold hover:bg-black/5", item === language && "bg-[var(--accent-soft)] text-[var(--accent)]")}
                    >
                      {LANGUAGE_META[item].native}
                      {item === language ? <Check className="size-4" /> : null}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </header>

        {bootstrap?.consented && ["gate", "chapter", "question"].includes(stage) ? (
          <div className="border-b border-[var(--border)] px-4 py-3 sm:px-7">
            <div className="mb-2 flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
              <span>{copy(UI_COPY.progress)}</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} />
          </div>
        ) : null}

        <section className="flex flex-1 items-center justify-center p-4 sm:p-7 lg:p-10">
          {stage === "loading" ? (
            <div className="grid place-items-center gap-4 text-center">
              <div className="grid size-14 place-items-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]"><LoaderCircle className="size-6 animate-spin" /></div>
              <p className="text-sm font-semibold text-[var(--muted)]">Opening your private invitation...</p>
            </div>
          ) : null}

          {stage === "language" ? (
            <Card className="fade-up w-full max-w-xl p-5 sm:p-8">
              <IconStamp><Languages className="size-5" /></IconStamp>
              <h1 className="mt-7 font-[family-name:var(--font-serif)] text-4xl font-semibold tracking-[-0.04em]">{copy(UI_COPY.chooseLanguage)}</h1>
              <p className="mt-3 leading-7 text-[var(--muted)]">{copy(UI_COPY.languageHint)}</p>
              <div className="mt-7 grid gap-2 sm:grid-cols-2">
                {LANGUAGES.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => void selectLanguage(item)}
                    className="flex min-h-14 items-center justify-between rounded-2xl border border-[var(--border)] bg-white px-4 text-start font-bold transition hover:-translate-y-0.5 hover:border-[var(--accent)]"
                  >
                    {LANGUAGE_META[item].native}
                    <ArrowRight className={cn("size-4", direction === "rtl" && "rotate-180")} />
                  </button>
                ))}
              </div>
            </Card>
          ) : null}

          {stage === "welcome" && bootstrap ? (
            <div className="fade-up grid w-full max-w-4xl gap-6 lg:grid-cols-[1.08fr_0.92fr]">
              <Card className="p-6 sm:p-9">
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--accent)]">{copy(UI_COPY.welcomeEyebrow)}</div>
                <h1 className="mt-5 font-[family-name:var(--font-serif)] text-5xl font-semibold tracking-[-0.045em]">{copy(UI_COPY.welcomeTitle, { name: bootstrap.firstName })}</h1>
                <p className="mt-6 text-[17px] leading-8 text-[var(--muted)]">{copy(UI_COPY.welcomeBody)}</p>
                <div className="mt-6 rounded-2xl bg-[var(--accent-soft)] px-4 py-3 text-sm font-bold text-[var(--accent)]">{copy(UI_COPY.honestBeats)}</div>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button size="lg" onClick={acceptWelcome}>{copy(UI_COPY.curious)} <ArrowRight className={cn("size-4", direction === "rtl" && "rotate-180")} /></Button>
                  <Button size="lg" variant="secondary" onClick={declineWelcome}>{copy(UI_COPY.notForMe)}</Button>
                </div>
              </Card>
              <div className="relative min-h-80 overflow-hidden rounded-[28px] border border-[var(--border)] bg-[#292624] p-6 text-white">
                <div className="absolute -end-16 -top-20 size-64 rounded-full bg-[var(--accent)]/55" />
                <div className="absolute -bottom-24 -start-24 size-72 rounded-full bg-[var(--sage)]/80" />
                <div className="relative flex h-full flex-col justify-between">
                  <Sparkles className="size-6 text-white/80" />
                  <div>
                    <div className="font-[family-name:var(--font-serif)] text-4xl leading-tight">A small, honest check before we keep talking.</div>
                    <div className="mt-5 flex items-center gap-2 text-sm text-white/65"><Clock3 className="size-4" /> Thoughtful, private, unhurried.</div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {stage === "consent" ? (
            <Card className="fade-up w-full max-w-2xl p-6 sm:p-9">
              <div className="flex gap-4"><IconStamp><ShieldCheck className="size-5" /></IconStamp><div><div className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--accent)]">Privacy first</div><h1 className="mt-2 font-[family-name:var(--font-serif)] text-4xl font-semibold tracking-[-0.04em]">{copy(UI_COPY.consentTitle)}</h1></div></div>
              <p className="mt-7 text-[16px] leading-8 text-[var(--muted)]">{copy(UI_COPY.consentBody)}</p>
              <div className="mt-6 grid gap-3 rounded-2xl border border-[var(--border)] bg-white p-4 text-sm leading-6 text-[var(--muted)] sm:grid-cols-2">
                <div className="flex gap-3"><Check className="mt-0.5 size-4 shrink-0 text-[var(--sage)]" /> Meaningful actions and saved drafts</div>
                <div className="flex gap-3"><LockKeyhole className="mt-0.5 size-4 shrink-0 text-[var(--sage)]" /> No keystrokes, passwords, or device data</div>
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" onClick={() => void acceptConsent()}>{copy(UI_COPY.consentAccept)}</Button>
                <Button size="lg" variant="secondary" onClick={declineConsent}>{copy(UI_COPY.consentDecline)}</Button>
              </div>
            </Card>
          ) : null}

          {stage === "profile" ? (
            <div className="fade-up grid w-full max-w-4xl gap-6 lg:grid-cols-[0.78fr_1.22fr]">
              <div className="relative overflow-hidden rounded-[28px] border border-[var(--border)] bg-white p-3 shadow-[0_15px_45px_rgba(74,52,38,0.10)]">
                <Image src="/naim-portrait.svg" alt="A stylized portrait placeholder for Naim" width={900} height={1125} priority className="h-full min-h-96 w-full rounded-[22px] object-cover" />
              </div>
              <Card className="p-6 sm:p-8">
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--accent)]">{copy(UI_COPY.meetTitle)}</div>
                <div className="mt-5 grid gap-2 sm:grid-cols-2">
                  {PROFILE_TRAITS.map((trait, index) => (
                    <div key={index} className="flex min-h-16 items-center gap-3 rounded-2xl border border-[var(--border)] bg-white px-4 text-sm font-semibold">
                      <div className="grid size-7 shrink-0 place-items-center rounded-full bg-[var(--sage-soft)] text-[var(--sage)]"><Check className="size-4" /></div>
                      {uiText(trait, language)}
                    </div>
                  ))}
                </div>
                <div className="mt-6 rounded-3xl bg-[#292624] p-5 text-white">
                  <div className="flex items-center gap-3"><Heart className="size-5 text-[#f0a9b8]" fill="currentColor" /><h2 className="font-[family-name:var(--font-serif)] text-2xl font-semibold">{copy(UI_COPY.knowTitle)}</h2></div>
                  <p className="mt-4 text-sm leading-7 text-white/70">{copy(UI_COPY.knowBody)}</p>
                </div>
                <div className="mt-7 flex justify-end"><Button size="lg" onClick={startGates}>{copy(UI_COPY.continue)} <ArrowRight className={cn("size-4", direction === "rtl" && "rotate-180")} /></Button></div>
              </Card>
            </div>
          ) : null}

          {stage === "gate" && currentGate ? (
            <QuestionCard
              question={currentGate}
              value={answerRecord[currentGate.id]}
              language={language}
              onOption={(optionId) => void chooseOption(currentGate, optionId)}
              onText={(value) => changeText(currentGate, value)}
              onBack={goBack}
              onNext={() => void nextGate()}
              nextLabel={copy(UI_COPY.next)}
              backLabel={copy(UI_COPY.back)}
              validationMessage={validationMessage}
              saveState={saveState}
              direction={direction}
            />
          ) : null}

          {stage === "chapter" ? (
            <Card className="fade-up w-full max-w-2xl overflow-hidden">
              <div className="bg-[#292624] p-7 text-white sm:p-10">
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-[#f0a9b8]">{localize(chapter.eyebrow, language)}</div>
                <h1 className="mt-5 font-[family-name:var(--font-serif)] text-5xl font-semibold leading-[1.02] tracking-[-0.045em]">{localize(chapter.title, language)}</h1>
                <p className="mt-6 max-w-xl leading-8 text-white/65">{localize(chapter.description, language)}</p>
              </div>
              <div className="flex items-center justify-between gap-3 p-5 sm:p-7">
                <div className="text-sm font-semibold text-[var(--muted)]">{questionsForChapter(chapter.id, answerRecord).length} thoughtful questions</div>
                <Button size="lg" onClick={startChapter}>{copy(UI_COPY.continue)} <ArrowRight className={cn("size-4", direction === "rtl" && "rotate-180")} /></Button>
              </div>
            </Card>
          ) : null}

          {stage === "question" && activeQuestion ? (
            <QuestionCard
              question={activeQuestion}
              value={answerRecord[activeQuestion.id]}
              language={language}
              onOption={(optionId) => void chooseOption(activeQuestion, optionId)}
              onText={(value) => changeText(activeQuestion, value)}
              onBack={goBack}
              onNext={() => void goToNextQuestion()}
              nextLabel={activeQuestion.id === "q34" ? copy(UI_COPY.submit) : copy(UI_COPY.next)}
              backLabel={copy(UI_COPY.back)}
              validationMessage={validationMessage}
              saveState={saveState}
              direction={direction}
              loading={submitting}
            />
          ) : null}

          {stage === "submitted" ? (
            <Card className="fade-up w-full max-w-2xl p-7 text-center sm:p-10">
              <div className="mx-auto grid size-16 place-items-center rounded-full bg-[var(--sage-soft)] text-[var(--sage)]"><Check className="size-7" /></div>
              <h1 className="mt-7 font-[family-name:var(--font-serif)] text-5xl font-semibold tracking-[-0.045em]">{copy(UI_COPY.submittedTitle)}</h1>
              <p className="mx-auto mt-6 max-w-xl text-[17px] leading-8 text-[var(--muted)]">{copy(UI_COPY.submittedBody)}</p>
              <div className="mt-7 text-sm font-semibold text-[var(--muted)]">Take care until then.</div>
              <button type="button" onClick={() => setDeleteOpen(true)} className="mt-10 inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold text-[var(--danger)] hover:bg-[var(--danger-soft)]"><Trash2 className="size-4" />{copy(UI_COPY.delete)}</button>
            </Card>
          ) : null}

          {stage === "exit" ? (
            <Card className="fade-up w-full max-w-xl p-7 text-center sm:p-10">
              <div className="mx-auto grid size-16 place-items-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]"><Heart className="size-7" /></div>
              <h1 className="mt-7 font-[family-name:var(--font-serif)] text-4xl font-semibold tracking-[-0.04em]">{copy(UI_COPY.allGood)}</h1>
              <p className="mt-5 text-sm text-[var(--muted)]">Your answer was clear. No explanation is required.</p>
              {bootstrap?.consented ? <button type="button" onClick={() => setDeleteOpen(true)} className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold text-[var(--danger)] hover:bg-[var(--danger-soft)]"><Trash2 className="size-4" />{copy(UI_COPY.delete)}</button> : null}
              <span className="sr-only">{exitReason}</span>
            </Card>
          ) : null}

          {stage === "deleted" ? (
            <Card className="fade-up w-full max-w-xl p-7 text-center sm:p-10">
              <div className="mx-auto grid size-16 place-items-center rounded-full bg-[var(--sage-soft)] text-[var(--sage)]"><ShieldCheck className="size-7" /></div>
              <h1 className="mt-7 font-[family-name:var(--font-serif)] text-4xl font-semibold tracking-[-0.04em]">{copy(UI_COPY.deletedTitle)}</h1>
              <p className="mt-5 leading-7 text-[var(--muted)]">Nothing from your questionnaire remains visible in the private dashboard.</p>
            </Card>
          ) : null}

          {stage === "error" ? (
            <Card className="fade-up w-full max-w-xl p-7 text-center sm:p-10">
              <div className="mx-auto grid size-16 place-items-center rounded-full bg-[var(--danger-soft)] text-[var(--danger)]"><CircleAlert className="size-7" /></div>
              <h1 className="mt-7 font-[family-name:var(--font-serif)] text-4xl font-semibold tracking-[-0.04em]">{errorMessage || copy(UI_COPY.invalid)}</h1>
              <Button className="mt-8" variant="secondary" onClick={() => void bootstrapInvitation(language)}><RotateCcw className="size-4" />{copy(UI_COPY.retry)}</Button>
            </Card>
          ) : null}
        </section>

        {bootstrap?.consented && ["gate", "chapter", "question"].includes(stage) ? (
          <footer className="flex items-center justify-between gap-3 border-t border-[var(--border)] px-4 py-3 text-xs text-[var(--muted)] sm:px-7">
            <span>Only Naim receives these answers.</span>
            <button type="button" onClick={() => setDeleteOpen(true)} className="inline-flex min-h-9 items-center gap-1.5 rounded-full px-3 font-semibold text-[var(--danger)] hover:bg-[var(--danger-soft)]"><Trash2 className="size-3.5" />{copy(UI_COPY.delete)}</button>
          </footer>
        ) : null}
      </div>

      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)} title={copy(UI_COPY.deleteTitle)}>
        <p className="leading-7 text-[var(--muted)]">{copy(UI_COPY.deleteBody)}</p>
        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={() => setDeleteOpen(false)}>{copy(UI_COPY.cancel)}</Button>
          <Button variant="danger" loading={deleting} onClick={() => void deleteEverything()}><Trash2 className="size-4" />{copy(UI_COPY.confirmDelete)}</Button>
        </div>
      </Modal>
    </main>
  );
}

function QuestionCard({
  question,
  value,
  language,
  onOption,
  onText,
  onBack,
  onNext,
  nextLabel,
  backLabel,
  validationMessage,
  saveState,
  direction,
  loading,
}: {
  question: QuestionDefinition;
  value: AnswerValue | undefined;
  language: Language;
  onOption: (id: string) => void;
  onText: (value: string) => void;
  onBack: () => void;
  onNext: () => void;
  nextLabel: string;
  backLabel: string;
  validationMessage: string;
  saveState: SaveState;
  direction: "ltr" | "rtl";
  loading?: boolean;
}) {
  const textValue = typeof value === "string" ? value : "";
  return (
    <Card className="soft-enter w-full max-w-3xl p-5 sm:p-8 lg:p-10">
      <div className="flex items-start gap-4">
        <IconStamp>{question.type === "text" ? <Sparkles className="size-5" /> : <Heart className="size-5" />}</IconStamp>
        <div className="min-w-0">
          <div className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--accent)]">{question.gate ? "A quick check" : question.type === "text" ? "In your own words" : question.type === "multi" ? "Choose all that fit" : "Choose what feels true"}</div>
          <h1 className="mt-3 font-[family-name:var(--font-serif)] text-3xl font-semibold leading-tight tracking-[-0.035em] sm:text-4xl">{localize(question.prompt, language)}</h1>
          {question.helper ? <p className="mt-4 leading-7 text-[var(--muted)]">{localize(question.helper, language)}</p> : null}
        </div>
      </div>

      {question.type === "text" ? (
        <div className="mt-7">
          <Textarea
            value={textValue}
            onChange={(event) => onText(event.target.value)}
            placeholder={localize(question.placeholder, language) || "Write your honest answer..."}
            maxLength={question.maxLength}
            rows={7}
            aria-label={localize(question.prompt, language)}
          />
          <div className="mt-2 flex items-center justify-between gap-3 text-xs text-[var(--muted)]">
            <span>{saveState === "saving" ? "Saving draft..." : saveState === "saved" ? "Draft saved" : "Saved as you write"}</span>
            <span>{textValue.length}{question.maxLength ? ` / ${question.maxLength}` : ""}</span>
          </div>
        </div>
      ) : (
        <div className="mt-7 grid gap-2.5">
          {question.options?.map((item) => {
            const selected = Array.isArray(value) ? value.includes(item.id) : value === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onOption(item.id)}
                className={cn(
                  "group flex min-h-14 w-full items-center gap-3 rounded-2xl border px-4 py-3 text-start text-[15px] font-semibold leading-6 transition hover:-translate-y-0.5 hover:border-[var(--accent)]",
                  selected ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--foreground)]" : "border-[var(--border)] bg-white",
                )}
                aria-pressed={selected}
              >
                <span className={cn("grid size-6 shrink-0 place-items-center border transition", question.type === "multi" ? "rounded-lg" : "rounded-full", selected ? "border-[var(--accent)] bg-[var(--accent)] text-white" : "border-[var(--border)] bg-white")}>
                  {selected ? <Check className="size-3.5" strokeWidth={3} /> : null}
                </span>
                <span>{localize(item.label, language)}</span>
              </button>
            );
          })}
        </div>
      )}

      {validationMessage ? <div className="mt-5 flex items-start gap-2 rounded-2xl bg-[var(--danger-soft)] px-4 py-3 text-sm font-semibold text-[var(--danger)]"><CircleAlert className="mt-0.5 size-4 shrink-0" />{validationMessage}</div> : null}

      <div className="mt-8 flex items-center justify-between gap-3">
        <Button type="button" variant="ghost" onClick={onBack}><ArrowLeft className={cn("size-4", direction === "rtl" && "rotate-180")} />{backLabel}</Button>
        <Button type="button" size="lg" loading={loading} onClick={onNext}>{nextLabel}<ArrowRight className={cn("size-4", direction === "rtl" && "rotate-180")} /></Button>
      </div>
    </Card>
  );
}
