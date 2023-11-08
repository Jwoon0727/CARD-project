import csv

f = open('sample.csv', 'w',encoding='utf-8', newline='')
wr = csv.writer(f)
wr.writerow([1,2,3])
wr.writerow([[1,2,3],[4,5,6],[7,8,9]])
f.close()