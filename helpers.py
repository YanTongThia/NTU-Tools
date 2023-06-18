from cs50 import SQL
import itertools

db = SQL("sqlite:///courses_actual.db")
columns = ["Mon","Tue","Wed","Thu","Fri","Sat"]

def create_s():
    tmp = []
    s = []
    for each in range(6):
        for each in range(16):
            tmp.append("0")
        s.append(tmp)
        tmp = []
    return s

def logic(comb):
    s = create_s()
    date = []
    for course_index_info in comb:
        date_index = columns.index(course_index_info['date'])
        date.append(date_index)
        start_splicing_index = (int((lambda x: (x - 730)/100)(int(course_index_info['start_time']))))
        end_splicing_index = (int((lambda x: (x + 10 - 730)/100)(int(course_index_info['end_time']))))
        if '1' in s[date_index][start_splicing_index:end_splicing_index]:
            return False
        s[date_index][start_splicing_index:end_splicing_index] = ['1'] * (end_splicing_index - start_splicing_index)
    if len(set(date)) <= 3:
        return True
    else:
        return False


def processing(requested):
    print(requested)
    index_info = []
    for each_request in requested:
        course_indexs_data = db.execute("select code,name,course_index,date,start_time,end_time from courses where code = ?",each_request)
        index_info.append(course_indexs_data)

    combs = itertools.product(*index_info)
    
    filtered_combs = (prod for prod in combs if logic(prod) == True)
    return list(filtered_combs)
    

def plot(comb):
    s = create_s()
    for course in comb:
        date_index = columns.index(course['date'])
        start_splicing_index = (int((lambda x: (x - 730)/100)(int(course['start_time']))))
        end_splicing_index = (int((lambda x: (x + 10 - 730)/100)(int(course['end_time']))))
        
        s[date_index][start_splicing_index:end_splicing_index] = [course['code']] * (end_splicing_index - start_splicing_index) 
    
    for day in range(6):
        for time in range(16):
            if s[day][time] == '0':
                s[day][time] = ''
    return s