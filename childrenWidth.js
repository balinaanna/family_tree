function childrenWidth(parent) {
	var children = JSON.parse(parent.info.ch_ids);
	var total_width = 0;
	for (var i = children.length - 1; i >= 0; i--) {
		children[i] = {'id':children[i], 'width': NODE_WIDTH};	// NODE_WIDTH + margin !!!
		if(objects[children[i].id].ch_ids!=[]){
			if(objects[children[i].id].spouse_id!=''){
				children[i].width = 2*children[i].width;
			}
			if(childrenWidth(objects[children[i].id])>children[i].width) {
				children[i].width = childrenWidth(objects[children[i].id]);
			}
		}
		total_width = total_width + children[i].width;
	}
	if(total_width == 0) { total_width = NODE_WIDTH; }	// NODE_WIDTH + margin !!!
	return total_width;
}