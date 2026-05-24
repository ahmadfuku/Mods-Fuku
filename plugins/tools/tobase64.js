let handler = async (m, { text, fukusima }) => {
  try {
    if (!text) {
      return fukusima.reply(
        m.chat,
        `Contoh:\n.tobase64 halo world`,
        m
      )
    }

    const hasil = Buffer
      .from(text, "utf-8")
      .toString("base64")

    await fukusima.reply(
      m.chat,
      `乂  *T O  B A S E 6 4*

📄 Text:
${text}

🔐 Base64:
${hasil}`,
      m
    )

  } catch (e) {
    await fukusima.reply(
      m.chat,
      `❌ Error\n\n${e.message}`,
      m
    )
  }
}

handler.help = ["tobase64"]
handler.tags = ["tools"]
handler.command = /^tobase64$/i

export default handler