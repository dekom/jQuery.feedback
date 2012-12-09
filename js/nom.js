var $this = $("#nomContainer")
  , feedback = $("#feedback")
  , send = $("#send")
  , active = false

$this.nom('init')

function mouseenter() {
  console.log('mouseenter')
}

function mouseleave() {
  console.log('mouseleave')
}

function click(element) {
}

feedback.click( function() {
                  if (active) {
                    $this.nom('deactivate')
                    active = false
                  } else {
                    $this.nom(  'activate'
                             ,  { mouseenter: mouseenter
                                , mouseleave: mouseleave
                                , click: click
                                }
                             )
                    active = true
                  }
                }
              )

send.click( function() {
              $this.nom(  'output'
                       ,  function(doms, jsons) {
                            console.log(doms)
                            console.log(jsons)
                            $this.nom('deactivate')
                            active = false
                          }
                       )
            }
          )
