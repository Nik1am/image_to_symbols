canvas = document.createElement("canvas")
ctx = canvas.getContext("2d")
//▖▗▘▙▚▛▜▝▞▟ 
symbols_str = "░▀▄█"

bayer_mat = [
    [  0,128, 32,160],
    [192, 64,224, 96],
    [ 48,176, 16,144],
    [240,112,208, 80],
]

function read(e){
    reader = new FileReader()
    reader.readAsDataURL(e.files[0])
    reader.onload = () => {
        src_to_Image(reader.result)
    }
}

function src_to_Image(src){
    img = new Image()
    img.src = src
    img.onload = () => {
        Image_to_bw_array(img)
    }
}

function Image_to_bw_array(img){
    canvas.width = img.width
    canvas.height = img.height
    ctx.drawImage(img, 0, 0)
    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    bw_array = []
    for(i = 0; i < imageData.data.length; i += 4) {
        r = imageData.data[i + 0]
        g = imageData.data[i + 1]
        b = imageData.data[i + 2]
        a = imageData.data[i + 3]

        gray = (r + g + b) / 3
        bw_array.push(Math.floor(gray))
    }
    console.log(bw_array)
    bw_array_to_text(bw_array,img.width)
}

function bw_array_to_text(bw_array,width){
    result_text = ""
    onebit_array = new Array(bw_array.length)
    for(i = 0; i < bw_array.length; i += 1) {
        x = i % width
        y = Math.floor(i / width)
        bayer_value = bayer_mat[y % 4][x % 4]
        if(bw_array[i] > bayer_value){
            onebit_array[i] = 1
        }
        else {
            onebit_array[i] = 0
        }
    }

    for(i = 0; i < onebit_array.length; i += 1){
        //newline
        if(i%width == 0){
            result_text += "\n"
        } 

        //scan every 2 lines
        if( (i-1)%width == width-1){
            i += width
        }
        
        // Upper/Lower half
        uh = onebit_array[i]
        lh = onebit_array[i+width]
        pixel_symbol = ""
        if(!do_invert.checked){
            pixel_symbol = symbols_str[symbols_str.length - 1 - (uh + (lh << 1))]
        }
        else {
            pixel_symbol = symbols_str[(uh + (lh << 1))]
        }
        if(pixel_symbol){
            result_text += pixel_symbol
        }
    }
    result_element.innerText = result_text
}