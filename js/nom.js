var $this = $("#plate")
  , feedback = $("#feedback")
  , send = $("#send")

$this.nom('init')

function mouseover() {
  console.log('mouseover')
}

function click() {
  console.log('click')
}

feedback.click( function() {
                  $this.nom(  'activate'
                           ,  { mouseover: mouseover
                              , click: click
                              }
                           )
                }
              )

send.click( function() {
              $this.nom(  'output'
                       ,  function(json) {
                            console.log(json)
                          }
                       )
            }
          )
