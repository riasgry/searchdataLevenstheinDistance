const search = document.getElementById('search');
const matchList = document.getElementById('match_list');
const searchStates = async searchText =>{

           var input;
			function splitSearch(){
			    let splitter = searchText.split(/[\s,!]+/);
				input=splitter;
			}
			splitSearch();
			$( function() {
				$('#search').autocomplete({
					source: function(req,res){
						$.ajax({
							type: 'POST',
							url: '/autocomplete/getInput',
							data: req={input:input} ,
							success: function(data) {
								console.log(data)
								res($.map(data, function(item) {
									return {
										label: item.nama_perusahaan,//text comes from a collection of mongo
										value: item.nama_perusahaan
									};
								}));
									
						},
							error: function(error) {
								console.log("some error in fetching the notifications");
							 }
						});
					}
				})
			})
			

			
}
let typingTimer;                //timer identifier
let doneTypingInterval = 0;  //time in ms (5 seconds)
search.addEventListener('input',() => {
    clearTimeout(typingTimer);
    if (search.value) {
        typingTimer = setTimeout(doneTyping, doneTypingInterval);
    }
});

function doneTyping(){
	searchStates(search.value);
}

