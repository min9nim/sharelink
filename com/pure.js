
export function _findLink(links, linkID){
    let link;
    for(let l of links){
        if(l.id === linkID){
            link = l;
        }else{
            for(let l2 of l.refLinks){
                if(l2.id === linkID){
                    link = l2;
                    break;
                }
            }
        }
        if(link) break;
    }
    
    return link;
}