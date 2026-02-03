import z from "zod";


export const chatSchema = z.object({
  message: z.string()
    .min(0, "Message cannot be empty")
    .refine((val) => {
      const phoneRegex = /(\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9})/;
      const emailRegex = /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/;
      const keywords = /(whatsapp|telegram|instagram|insta|facebook|skype|number|email|phn|num|wtsp|tele|linkedin|http|https| @)/i;
      const linkRegex = /(([a-z0-9]+\.)*[a-z0-9]+\.[a-z]{2,}(?:\/+[^\s]*)?)/i;
      return !phoneRegex.test(val) && !emailRegex.test(val) && !keywords.test(val) && !linkRegex.test(val);
    }, {
      message: "Sharing contact info (phone, email, social, link) is prohibited."
    })
});