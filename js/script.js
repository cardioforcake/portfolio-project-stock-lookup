// J36R13I21ZLCVIYU

// https://quickchart.io/chart/render/zm-1e0881bd-7b77-4b3b-82f8-6b7e2d3a777e
let stock, series, oneWeek, oneMonth, threeMonths, imgUrl;

$('.image').click(function(){
    if($('.menu').hasClass('hide')){
        dropMenu()
    }else if($('.menu').hasClass('canTouch')){
        retractMenu()
    }
})

$('body').click(function(){
    if($('.menu').hasClass('canTouch')){
        retractMenu()
    }
})

$('.menu').click(function(event){
    event.stopPropagation()
})

$('.last').click(function(){
    if(window.localStorage.getItem('current')!==null){

        let newDate = new Date()
        series = []
        for(let i=0; i<31; i++){
            newDate.setDate(newDate.getDate()-1)
            let year = newDate.getFullYear()
            let month = newDate.getMonth()
            let date = newDate.getDate()
            if(month<9){
                month++
                month = `0${month}`
            }else{
                month++
            }
            if(date<10){
                date = `0${date}`
            }
            series.push(`${year}-${month}-${date}`)
        }
    
        $.ajax({
            url: 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol='+window.localStorage.getItem('current')+'&apikey=J36R13I21ZLCVIYU'
        }).then(
            function(data){
                stock = window.localStorage.getItem('current').toUpperCase()
    
                let xLabels = ""
                let yLabels = ""
                let yScale = []
        
                for(let i = series.length; i>=0; i--){
                    if(series[i] in data['Time Series (Daily)']){
                        xLabels += "'" + series[i].slice(5) +"',"
                        yLabels += data['Time Series (Daily)'][series[i]]['4. close']+','
                        yScale.push(data['Time Series (Daily)'][series[i]]['4. close'])
                    }
                }
        
                xLabels = xLabels.slice(0,-1)
                yLabels = yLabels.slice(0,-1)
        
                let minimum = Math.min.apply(Math, yScale)
        
                imgUrl = 'https://quickchart.io/chart?c={type:%27line%27,data:{labels:['+xLabels+'],datasets:[{label:%27'+stock+'%27,data:['+yLabels+']}]}}&backgroundColor=%23f5fffa'
        
                $('.graph').attr('src',imgUrl)
                $('.display').removeClass('hide')
                if($('.menu').hasClass('canTouch')){
                    retractMenu()
                }
            }
        )
    }
})

$('.clear').click(function(){
    $('.graph').attr('src','')
    $('.display').addClass('hide')
    if($('.menu').hasClass('canTouch')){
        retractMenu()
    }
})


$('form').on('submit', display)


$('.clear').click(function(){
    if(!$('.menu').hasClass('dontTouch')){
        $('.forecast').addClass('hide')
        if($('.menu').hasClass('canTouch')){
            retractMenu()
        }
    }
})

function dropMenu(){
    $('.menu').removeClass('hide')
    $('.menu').addClass('hide3')
    setTimeout(()=>{
        $('.menu').removeClass('dontTouch')
        $('.menu').addClass('canTouch')
    }, 400)
}

function retractMenu(){
    $('.menu').removeClass('canTouch')
    $('.menu').removeClass('hide3')
    $('.menu').addClass('hide4')
    $('.menu').addClass('dontTouch')
    setTimeout(() => {
        $('.menu').addClass('hide')
        $('.menu').removeClass('hide4')
    }, 400);
}


function display(ev){
    ev.preventDefault()
    let newDate = new Date()
    series = []
    for(let i=0; i<31; i++){
        newDate.setDate(newDate.getDate()-1)
        let year = newDate.getFullYear()
        let month = newDate.getMonth()
        let date = newDate.getDate()
        if(month<9){
            month++
            month = `0${month}`
        }else{
            month++
        }
        if(date<10){
            date = `0${date}`
        }
        series.push(`${year}-${month}-${date}`)
    }

    $.ajax({
        url: 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol='+$('input[type="text"]').val()+'&apikey=J36R13I21ZLCVIYU'
    }).then(
        function(data){
            stock = $('input[type="text"]').val().toUpperCase()
            window.localStorage.setItem('current',$('input[type="text"]').val())
            $('input[type="text"]').val('')

            if('Error Message' in data){
                alert('Ticker symbol not found')
            }

            let xLabels = ""
            let yLabels = ""
            let yScale = []

            for(let i = series.length; i>=0; i--){
                if(series[i] in data['Time Series (Daily)']){
                    xLabels += "'" + series[i].slice(5) +"',"
                    yLabels += data['Time Series (Daily)'][series[i]]['4. close']+','
                    yScale.push(data['Time Series (Daily)'][series[i]]['4. close'])
                }
            }

            xLabels = xLabels.slice(0,-1)
            yLabels = yLabels.slice(0,-1)

            let minimum = Math.min.apply(Math, yScale)

            imgUrl = 'https://quickchart.io/chart?c={type:%27line%27,data:{labels:['+xLabels+'],datasets:[{label:%27'+stock+'%27,data:['+yLabels+']}]}}&backgroundColor=%23f5fffa'

            $('.graph').attr('src',imgUrl)
            $('.display').removeClass('hide')

            console.log(imgUrl)
        },
        function(){
            alert('Ticker symbol not found')
            $('input[type="text"]').val('')
        }
    )
}
