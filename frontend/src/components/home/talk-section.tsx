"use client"

import { useMemo } from "react"

export type TalkSectionProps = {
    title?: string
    description?: string
    liveInput?: string
    replayInput?: string
}

const FALLBACK_TALK: TalkSectionProps = {
    title: "TỌA ĐÀM TRỰC TUYẾN",
    description: "Tham gia buổi trò chuyện trực tiếp cùng các chuyên gia để cập nhật thông tin mới nhất.",
    liveInput: `https://www.youtube.com/watch?v=NWys5zmK9wo`,
    replayInput: `<iframe src="https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F818742077735961%2F&show_text=false&width=476&t=0" width="476" height="476" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowFullScreen="true"></iframe>`,
}

function toEmbedUrl(url?: string) {
    if (!url) return ""
    const u = url.trim()
    // YouTube: chuyển watch -> embed
    if (/youtube\.com\/watch\?v=/.test(u)) {
        const id = new URL(u).searchParams.get("v")
        return id ? `https://www.youtube.com/embed/${id}` : u
    }
    if (/youtu\.be\//.test(u)) {
        const id = u.split("/").pop()?.split(/[?&]/)[0]
        return id ? `https://www.youtube.com/embed/${id}` : u
    }
    // Facebook (đã là embed)
    if (/facebook\.com\/plugins\/video\.php/.test(u)) return u
    // Facebook video URL -> chuyển thành plugin embed
    if (/facebook\.com\/.+\/videos\//.test(u)) {
        try {
            const normalized = new URL(u)
            return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(normalized.toString())}&show_text=false&width=560`
        } catch (_error) {
            return u
        }
    }
    if (/fb\.watch\//.test(u)) {
        const id = u.split("/").pop()?.split(/[?&]/)[0]
        if (id) {
            const watchUrl = `https://www.facebook.com/watch/?v=${id}`
            return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(watchUrl)}&show_text=false&width=560`
        }
    }
    // Vimeo (đã là embed hoặc dạng /video/{id})
    if (/player\.vimeo\.com\/video\//.test(u)) return u
    return u
}

type NormalizedEmbed = {
    html: string
    ratio?: number
    width?: number
    height?: number
}

function normalizeEmbedHtml(html?: string): NormalizedEmbed | null {
    if (!html) return null
    const trimmed = html.trim()
    if (!trimmed) return null

    const widthMatch = trimmed.match(/width="(\d+)"/i)
    const heightMatch = trimmed.match(/height="(\d+)"/i)
    const width = widthMatch ? Number(widthMatch[1]) : undefined
    const height = heightMatch ? Number(heightMatch[1]) : undefined
    const ratio = width && height && width > 0 && height > 0 ? width / height : undefined

    if (!/<iframe[\s>]/i.test(trimmed)) {
        return { html: trimmed, ratio, width, height }
    }

    const targetStyle = "border:none;overflow:hidden;position:absolute;top:0;left:0;width:100%;height:100%;"

    let normalized = trimmed
        .replace(/width="[^"]*"/gi, 'width="100%"')
        .replace(/height="[^"]*"/gi, 'height="100%"')

    if (/style="[^"]*"/i.test(normalized)) {
        normalized = normalized.replace(/style="[^"]*"/i, `style="${targetStyle}"`)
    } else {
        normalized = normalized.replace(/<iframe/i, `<iframe style="${targetStyle}"`)
    }

    return { html: normalized, ratio, width, height }
}

type ResolvedEmbed = {
    src?: string
    embed: NormalizedEmbed | null
}

function resolveEmbedInput(input?: string, embedHtml?: string): ResolvedEmbed {
    const trimmedInput = input?.trim()
    const isIframeInput = trimmedInput ? /<iframe[\s>]/i.test(trimmedInput) : false

    const src = !isIframeInput && trimmedInput ? toEmbedUrl(trimmedInput) || undefined : undefined

    const htmlCandidate = isIframeInput ? trimmedInput : embedHtml
    const embed = normalizeEmbedHtml(htmlCandidate)

    return { src, embed }
}

export default function TalkSection(props: TalkSectionProps) {
    const {
        title,
        description,
        liveInput,
        replayInput,
    } = { ...FALLBACK_TALK, ...props }
    const liveSource = resolveEmbedInput(liveInput)
    const replaySource = resolveEmbedInput(replayInput)

    const state: "live" | "replay" | "empty" = liveSource.src
        ? "live"
        : replaySource.src
            ? "replay"
            : liveSource.embed
                ? "live"
                : replaySource.embed
                    ? "replay"
                    : "empty"

    const src = useMemo(() => {
        if (state === "live") return liveSource.src || ""
        if (state === "replay") return replaySource.src || ""
        return ""
    }, [state, liveSource.src, replaySource.src])

    const fallbackEmbed = useMemo(() => {
        if (state === "live") return liveSource.embed
        if (state === "replay") return replaySource.embed
        return null
    }, [state, liveSource.embed, replaySource.embed])

    const aspectRatio = useMemo(() => {
        if (src) return 16 / 9
        if (fallbackEmbed?.ratio) return fallbackEmbed.ratio
        return 16 / 9
    }, [src, fallbackEmbed?.ratio])

    const containerPadding = useMemo(() => `${(1 / aspectRatio) * 100}%`, [aspectRatio])

    const containerStyle = useMemo(() => {
        if (src) return { paddingTop: containerPadding }
        if (fallbackEmbed) {
            const widthPx = fallbackEmbed.width ? `${fallbackEmbed.width}px` : undefined
            const heightPx = fallbackEmbed.height ? `${fallbackEmbed.height}px` : undefined
            return {
                width: widthPx ?? "100%",
                maxWidth: widthPx ?? "100%",
                height: heightPx,
                marginLeft: "auto",
                marginRight: "auto",
            }
        }
        return { paddingTop: containerPadding }
    }, [containerPadding, fallbackEmbed, src])

    const containerClassName = fallbackEmbed
        ? "relative rounded-lg border bg-card overflow-hidden"
        : "relative w-full rounded-lg border bg-card"

    return (
        <section id="talk" className="w-full bg-background py-16 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
                <div className="text-center mb-8">
                    <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-balance"
                        style={{ color: "#D4AF37" }}>{title}
                    </h2>
                    <div className="mx-auto mt-4 h-1 w-24 rounded-full" style={{ backgroundColor: "#D4AF37" }}/>
                    {description ? (
                        <p className="mt-3 text-muted-foreground">{description}</p>
                    ) : (
                        <p className="mt-3 text-muted-foreground">
                            {state === "live"
                                ? "Đang phát trực tiếp"
                                : state === "replay"
                                    ? "Phát lại từ nền tảng"
                                    : "Hiện chưa có tọa đàm"}
                        </p>
                    )}
                </div>

                <div className="relative w-full max-w-5xl mx-auto">
                    {/* Khung 16:9 theo theme */}
                    <div
                        className={containerClassName}
                        style={containerStyle}
                    >
                        {state === "empty" ? (
                            <div className="absolute inset-0 flex items-center justify-center text-center px-6">
                                <div>
                                    <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-muted" />
                                    <p className="text-foreground font-medium">Chưa có tọa đàm</p>
                                    <p className="text-sm text-muted-foreground mt-1">Vui lòng quay lại sau hoặc xem các nội dung khác.</p>
                                </div>
                            </div>
                        ) : src ? (
                            <iframe
                                src={src}
                                title={title}
                                className="absolute inset-0 h-full w-full"
                                loading="lazy"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allow="autoplay; encrypted-media; picture-in-picture"
                                allowFullScreen
                            />
                        ) : (
                            <div
                                className="absolute inset-0 h-full w-full"
                                dangerouslySetInnerHTML={fallbackEmbed ? { __html: fallbackEmbed.html } : undefined}
                            />
                        )}
                    </div>

                    <div className="mt-3 text-center text-sm text-muted-foreground">
                        {state === "live" ? "Đang hiển thị livestream." : state === "replay" ? "Đang hiển thị bản phát lại." : "Không có nội dung để phát."}
                    </div>
                </div>
            </div>
        </section>
    )
}