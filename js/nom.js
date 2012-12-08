var $this = $("#plate")
  , feedback = $("#feedback")
  , send = $("#send")
  , active = false

$this.nom('init')

function mouseover() {
  console.log('mouseover')
}

function click(element) {
  console.log('consumed:')
  console.log(element)
  console.log('click')
}

feedback.click( function() {
                  if (active) {
                    $this.nom('deactivate')
                  } else {
                    $this.nom(  'activate'
                             ,  { mouseover: mouseover
                                , click: click
                                }
                             )
                  }
                  active = !active
                }
              )

send.click( function() {
              $this.nom(  'output'
                       ,  function(doms, jsons) {
                            console.log(doms)
                            console.log(jsons)
                          }
                       )
            }
          )
