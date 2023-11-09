import torch
from diffusers import StableDiffusionImg2ImgPipeline, StableDiffusionPipeline
from scipy.spatial import KDTree
from webcolors import CSS3_HEX_TO_NAMES, hex_to_rgb


# TASK-1: - Task 1: Stable Diffusion’un Img2Img algoritmasını kullanarak verilen görsele benzer yeni
# bir görsel üretmek. Bunu seçeceğiniz hazır bir modelle yapabilirsiniz. Üretilen görselde
# bizim verdiğimiz bir rengin de kullanılmasını bekliyoruz.
# • Input: Image (png), Prompt (text), Renk (hex code)
# • Output: Image
def convert_rgb_to_names(rgb_tuple):
    # a dictionary of all the hex and their respective names in css3
    css3_db = CSS3_HEX_TO_NAMES
    names = []
    rgb_values = []
    for color_hex, color_name in css3_db.items():
        names.append(color_name)
        rgb_values.append(hex_to_rgb(color_hex))

    kdt_db = KDTree(rgb_values)
    distance, index = kdt_db.query(rgb_tuple)
    return names[index]


def call_stable_diffusion(image, prompt):
    device = "cuda"
    model_id_or_path = "runwayml/stable-diffusion-v1-5"
    if image and prompt != None:
        pipe = StableDiffusionImg2ImgPipeline.from_pretrained(model_id_or_path, torch_dtype=torch.float16)
        pipe = pipe.to(device)
        image = pipe(prompt=prompt, image=image, strength=0.75, guidance_scale=7.5).images[0]

    else:
        pipe = StableDiffusionPipeline.from_pretrained(model_id_or_path, torch_dtype=torch.float16)
        pipe = pipe.to(device)
        image = pipe(prompt=prompt).images[0]

    return image



def generate_image(image, prompt:str, color:str):
    color_name = convert_rgb_to_names(hex_to_rgb(color))
    init_image = image
    print(image.size)
    if image.size == (768, 512):
        init_image = init_image
    else:
        init_image = init_image.resize((224, 224))

    #init_image = init_image.resize((200, 200))
    prompt = f"Use {color_name} " + prompt
    new_image = call_stable_diffusion(init_image, prompt)
    torch.cuda.empty_cache()

    return new_image

#
# image = "https://raw.githubusercontent.com/CompVis/stable-diffusion/main/assets/stable-samples/img2img/sketch-mountains-input.jpg"
# prompt = "Surrealist painting of a floating island with giant clock gears, populated with mythical creatures."
# hex_color = '#befff7'
#
# logo = "assets/img2.png"
#
# new_image = generate_image(image=image, prompt=prompt, color=hex_color, logo=logo, punchline="TEST", button="test")


