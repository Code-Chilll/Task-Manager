package Model;

public class Task {

    private int id;
    private String Name;
    private boolean Completed;

    public int getId(){
        return id;
    }
    public void setId(int id){
        this.id = id;
    }

    public String getName(){
        return Name;
    }
    public void setName(String Name){
        this.Name = Name;
    }

    public boolean isCompleted(){
        return Completed;
    }
    public void setCompleted(boolean Completed){
        this.Completed = Completed;
    }
}
