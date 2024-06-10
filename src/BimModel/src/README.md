# General
    - Each class in each folder (class name)
    - Helper in each class in <class_name/src>

# ./Component :For base component  
# ./CubMapComponent :For CubMapComponent 
# ./DrawTool : For All draw element in ./src
    - ./BaseDraw : Abstract class
    - ./DrawArc : Draw Arc for beam and wall and all has sketch 
    - ./DrawCircle : Draw Circle for beam and wall and all has sketch 
    - ./DrawLine : Draw Line for beam and wall and all has sketch 
    - ./DrawPickLine : DrawPickLine for all has sketch 
    - ./DrawPoint : DrawPoint for column, furniture, door and window
    - ./DrawPolyLines : DrawPolyLines for multi element (beam,wall)
    - ./DrawRectangular : DrawRectangular for multi element (beam,wall)
# ./LevelSystem : For config level,views, navigation view
# ./MaterialComponent : For manage all material in project
# ./ModelingComponent : For manage all UI modeling  
    - ./src
        - ./constant : For all constant, every config in future in here
        - ./LineOption : For thin and thickness line
        - ./Modeling : For Top tab modeling
        - ./ModelingOption : For draw option line offset wall ...
        - ./Project : For CRUD project
        - ./Unit : For unit config
        - ./VisibilityOption : For visibility all element
        - ./WorkPlaneOption : For config work plane
        - ./WorkPlaneOption : For config work plane
    - ./types : For all types    
# ./ProjectComponent : For manage all project elements...
# ./RaycasterComponent : For cast element
# ./RendererComponent : For render three js
# ./SelectionComponent : For highlight
# ./Signals : For config side effect between UI 
# ./Snapper : For snap point
# ./system : For geometry,element...
# ./Tool : Base tool
# ./types : Base type
# ./utils : Base helper function
