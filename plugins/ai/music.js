import fetch from "node-fetch"
import fs from "fs"
import path from "path"

let handler = async (m, { text, fukusima, command }) => {

  if (!text) {
    return m.reply(`
*Format salah*

.${command} style|judul|lliri
`.trim())
  }

  const folderTmp = "./tmp"
  if (!fs.existsSync(folderTmp)) {
    fs.mkdirSync(folderTmp, { recursive: true })
  }
  function randomNama(panjang = 12) {
    const chars = "abcdefghijklmnopqrstuvwxyz1234567890"
    let hasil = ""
    for (let i = 0; i < panjang; i++) {
      hasil += chars[Math.floor(Math.random() * chars.length)]
    }
    return hasil
  }
  try {
    await fukusima.sendMessage(m.chat, {
      react: {
        text: "⏳",
        key: m.key
      }
    })
    const args = text.split("|")
    const style = args[0]?.trim()
    const judul = args[1]?.trim()
    const lirik = args[2]?.trim()
    if (!style || !judul || !lirik) {
      return m.reply(`
*Format salah*

.${command} style|judul|lirik
`.trim())
    }

    const urlApi =
      `https://myapi.astralune.cv/ai/music?prompt=${encodeURIComponent(style)}&title=${encodeURIComponent(judul)}&lyrics=${encodeURIComponent(lirik)}&isInstrumental=0&modelId=6`

    const response = await fetch(urlApi, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Referer": "https://myapi.astralune.cv/docs#cat-ai"
      }
    })

    const data = await response.json()

    if (!data.results || !data.results.length) {
      throw "Audio gagal dibuat"
    }

    await fukusima.sendMessage(m.chat, {
      react: {
        text: "🎧",
        key: m.key
      }
    })

    for (const item of data.results) {

      const namaFile = `${randomNama(15)}.mp3`

      const lokasiFile = path.join(folderTmp, namaFile)

      const audioResponse = await fetch(item.music_file)

      if (!audioResponse.ok) {
        continue
      }

      const buffer = Buffer.from(
        await audioResponse.arrayBuffer()
      )

      fs.writeFileSync(lokasiFile, buffer)

      await fukusima.sendMessage(m.chat, {
        audio: fs.readFileSync(lokasiFile),
        mimetype: "audio/mpeg",
        fileName: `${item.title}.mp3`,
        ptt: false,
        caption:
`🎵 AI MUSIC

📀 Judul : ${item.title}
🎼 Style : ${item.prompt}
📝 Lirik : ${item.lyrics}

© Fuku Gen`,
        contextInfo: {
          externalAdReply: {
            title: item.title,
            body: item.prompt,
            mediaType: 1,
            renderLargerThumbnail: false,
            showAdAttribution: false,
            thumbnailUrl: "https://files.catbox.moe/cuu1aa.jpg",
            sourceUrl: "https://github.com/ahmadfuku"
          }
        }
      }, {
        quoted: m
      })

      if (fs.existsSync(lokasiFile)) {
        fs.unlinkSync(lokasiFile)
      }
    }

    await fukusima.sendMessage(m.chat, {
      react: {
        text: "🫟",
        key: m.key
      }
    })

  } catch (e) {

    console.log(e)

    await fukusima.sendMessage(m.chat, {
      react: {
        text: "🙂‍↕️",
        key: m.key
      }
    })

    await fukusima.sendMessage(m.chat, {
      text: "Terjadi kesalahan saat membuat AI Music"
    }, {
      quoted: m
    })

  }
}

handler.help = ["aimusic", "musicai", "laguai"]
handler.tags = ["ai"]
handler.command = ["aimusic", "musicai", "laguai"]
handler.limit = true
handler.register = true
export default handler