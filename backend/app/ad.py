from PIL import Image, ImageDraw,ImageFont
#image = Image.new('RGB', (520, 520))
def add_text(image, font):
    '''Adds text on a given image object'''
    draw = ImageDraw.Draw(image)
    pillow_font = ImageFont.truetype(str(font.ttf), font.size)


empty_image = Image.open('C:\\Users\\Emine\\Desktop\\Projects\\React\\fastapi-react\\backend\\app\\assets\\1.png' )
empty_image = empty_image.resize((515, 511))

draw = ImageDraw.Draw(empty_image)
font = ImageFont.truetype("C:\\Users\\Emine\\Desktop\\Projects\\React\\fastapi-react\\backend\\app\\assets\\SourceSansPro-Regular.otf", 32)
# # draw.text((x, y),"Sample Text",(r,g,b))
draw.text((100, 380),"Sample Text",(0,0,0),font=font)
# Im.text((60, 50), "Marilyn Monroe",fill=(0, 0, 0))

logo = Image.open("C:\\Users\\Emine\\Desktop\\Projects\\React\\fastapi-react\\backend\\app\\assets\\img2.png")
logo = logo.resize((130, 50))
image = Image.open("C:\\Users\\Emine\\Desktop\\Projects\\React\\fastapi-react\\backend\\app\\assets\\img1.jpg")
image = image.resize((260, 250))

back_im =empty_image.copy()
back_im.paste(logo, (200, 30))
back_im.paste(image, (150, 100))




back_im.save('rocket_pillow_paste_pos.png', quality=95)


# image.show(back_im)