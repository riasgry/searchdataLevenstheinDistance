const search = document.getElementById('search');
const matchList = document.getElementById('match_list');
var table = document.getElementById("myTable");
const searchStates = async searchText =>{

           var input;
			function splitSearch(){
			    let splitter = searchText.split(/[\s,!]+/);
                input=splitter;
                console.log(input)
            }
            
			splitSearch();
			
				
						$.ajax({
							type: 'POST',
							url: '/testing/getInput',
							data: {input:input} ,
							success: function myFunction(data) {
								var row = table.insertRow(-1);
								var td1 = row.insertCell(0);
								var td2 = row.insertCell(1);
								var td3 = row.insertCell(2);
								var td4 = row.insertCell(3);
								var td5 = row.insertCell(4);
								var td6 = row.insertCell(5);
								var td7 = row.insertCell(6);
								var td8 = row.insertCell(7);
								var td9 = row.insertCell(8);
								var td10 = row.insertCell(9);
								td1.innerHTML= data.input;
								td2.innerHTML= data.cw;
								td3.innerHTML= data.nd;
								td4.innerHTML= data.td;
								td5.innerHTML= data.jcw;
								td6.innerHTML= data.jnd;
								td7.innerHTML= data.tj;
								td8.innerHTML= data.dlcw;
								td9.innerHTML= data.dlnd;
								td10.innerHTML= data.tdl;
								
						}
						});
			
			
}
let typingTimer;                //timer identifier
let doneTypingInterval = 1500;  //time in ms (5 seconds)
search.addEventListener('input',() => {
    clearTimeout(typingTimer);
    if (search.value) {
        typingTimer = setTimeout(doneTyping, doneTypingInterval);
    }
});

function doneTyping(){
	searchStates(search.value);
}

