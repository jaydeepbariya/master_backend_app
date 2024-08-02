import vine from "@vinejs/vine";


export const newsSchema = vine.object({
    title: vine.string().minLength(5).maxLength(150),
    content: vine.string().minLength(10).maxLength(5000)
});